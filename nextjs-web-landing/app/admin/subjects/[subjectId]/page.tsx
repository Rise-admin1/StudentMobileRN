"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminRequestError, adminFetch } from "@/lib/admin/client";
import { formatMinorAed, formatWhen } from "@/lib/admin/format";

type SubjectDetail = {
  id?: string;
  subjectName?: string;
  subjectDescription?: string | null;
  subjectPoints?: string[] | null;
  subjectImage?: string | null;
  subjectPrice?: number | null;
  subjectBoard?: string | null;
  subjectLanguage?: string | null;
  subjectGrade?: number | null;
  subjectDuration?: number | null;
  subjectVerification?: boolean;
  teacherVerification?: string[] | null;
  createdAt?: string;
  rejectedAt?: string | null;
  rejectionReason?: string | null;
  user?: {
    name?: string | null;
    email?: string | null;
  };
};

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function documentUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.toString();
  } catch {
    return null;
  }
  return null;
}

export default function SubjectVerificationPage() {
  const params = useParams<{ subjectId: string }>();
  const router = useRouter();
  const subjectId = params.subjectId;
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    adminFetch<SubjectDetail>(`/subjects/${subjectId}`)
      .then((data) => {
        if (active) setSubject(data);
      })
      .catch((err: unknown) => {
        if (!active) return;
        if (err instanceof AdminRequestError && err.status === 401) {
          window.location.href = "/admin/login";
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load subject");
      });
    return () => {
      active = false;
    };
  }, [subjectId]);

  const verify = async () => {
    try {
      setActing(true);
      setActionError(null);
      await adminFetch(`/subjects/verify/${subjectId}`, { method: "PUT", body: "{}" });
      router.replace("/admin/pending");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to verify subject");
    } finally {
      setActing(false);
    }
  };

  const reject = async () => {
    const trimmed = reason.trim();
    if (trimmed.length < 10) {
      setActionError("Please enter a rejection reason of at least 10 characters.");
      return;
    }
    try {
      setActing(true);
      setActionError(null);
      await adminFetch(`/subjects/reject/${subjectId}`, {
        method: "PUT",
        body: JSON.stringify({ reason: trimmed }),
      });
      router.replace("/admin/pending");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reject subject");
    } finally {
      setActing(false);
    }
  };

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!subject) return <p className="text-sm text-slate-500">Loading subject…</p>;

  const pending = !subject.subjectVerification && !subject.rejectedAt;
  const points = stringList(subject.subjectPoints);
  const documents = stringList(subject.teacherVerification)
    .map(documentUrl)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="space-y-4">
      {subject.subjectImage ? (
        // External course images are stored on S3 and are not part of the local image set.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={subject.subjectImage}
          alt=""
          className="h-48 w-full rounded-2xl object-cover"
        />
      ) : null}
      <div className="rounded-2xl border border-[#E8EEF4] bg-white p-5">
        <p className={`text-sm font-semibold ${subject.subjectVerification ? "text-green-700" : "text-amber-700"}`}>
          {subject.subjectVerification ? "Verified" : subject.rejectedAt ? "Rejected" : "Pending verification"}
        </p>
        <p className="mt-1 text-sm text-slate-500">Submitted on {formatWhen(subject.createdAt)}</p>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{subject.subjectName}</h1>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              {subject.subjectBoard ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{subject.subjectBoard}</span>
              ) : null}
              {subject.subjectGrade != null ? (
                <span className="rounded-full bg-orange-50 px-3 py-1 text-orange-700">
                  Grade {subject.subjectGrade}
                </span>
              ) : null}
            </div>
            {subject.user?.name || subject.user?.email ? (
              <p className="mt-3 text-sm text-slate-600">
                {subject.user?.name || "Teacher"}
                {subject.user?.email ? ` · ${subject.user.email}` : ""}
              </p>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Course fee</p>
            <p className="text-2xl font-semibold text-green-800">{formatMinorAed(subject.subjectPrice)}</p>
            {subject.subjectDuration != null ? (
              <p className="text-sm text-slate-500">{subject.subjectDuration} months</p>
            ) : null}
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-[#F4F6F8] p-3">
            <p className="text-xs text-slate-500">Language</p>
            <p className="font-medium">{subject.subjectLanguage || "—"}</p>
          </div>
          <div className="rounded-xl bg-[#F4F6F8] p-3">
            <p className="text-xs text-slate-500">Duration</p>
            <p className="font-medium">
              {subject.subjectDuration != null ? `${subject.subjectDuration} months` : "—"}
            </p>
          </div>
        </div>
        <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Course description</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {subject.subjectDescription || "No description"}
        </p>
        {points.length > 0 ? (
          <>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Course highlights</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-700">
              {points.map((point, index) => (
                <li key={`${index}-${point}`}>{point}</li>
              ))}
            </ol>
          </>
        ) : null}
        {subject.rejectionReason ? (
          <>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">Rejection reason</h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{subject.rejectionReason}</p>
          </>
        ) : null}
        {documents.length > 0 ? (
          <>
            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Verification documents
            </h2>
            <div className="mt-2 space-y-2">
              {documents.map((url, index) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-lg bg-[#1A2B4B] px-4 py-3 text-sm font-medium text-white"
                >
                  View document {index + 1}
                </a>
              ))}
            </div>
          </>
        ) : null}
        {actionError ? <p className="mt-4 text-sm text-red-600">{actionError}</p> : null}
        {pending ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={acting}
              onClick={verify}
              className="rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Verify subject
            </button>
            <button
              type="button"
              disabled={acting}
              onClick={() => {
                setReason("");
                setActionError(null);
                setRejectOpen(true);
              }}
              className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              Reject subject
            </button>
          </div>
        ) : null}
      </div>
      {rejectOpen ? (
        <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="w-full max-w-lg rounded-2xl bg-white p-5">
            <h2 className="text-lg font-semibold">Reject subject</h2>
            <p className="mt-1 text-sm text-slate-500">This reason is emailed to the teacher who owns the course.</p>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={5}
              placeholder="Explain why this course is not approved"
              className="mt-4 w-full rounded-lg border border-[#E8EEF4] px-3 py-2 text-sm outline-none"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={acting}
                onClick={() => setRejectOpen(false)}
                className="rounded-lg px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={acting}
                onClick={reject}
                className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {acting ? "Rejecting…" : "Confirm reject"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
