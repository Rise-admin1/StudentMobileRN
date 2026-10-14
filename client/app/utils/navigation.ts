import { CommonActions, NavigationProp, ParamListBase } from '@react-navigation/native';
import { Href, router } from 'expo-router';

export const goBack = (fallback: Href = '/(tabs)/home') => {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace(fallback);
};

export function resetToHome(navigation: NavigationProp<ParamListBase>): void {
  const parent = navigation.getParent();
  if (parent == null) {
    router.dismissTo('/(tabs)/home');
    return;
  }
  const state = parent.getState();
  const homeIndex = state.routes.findIndex((route) => route.name === 'home');
  if (homeIndex < 0) {
    router.dismissTo('/(tabs)/home');
    return;
  }
  const focusedTab = state.routes[state.index];
  parent.dispatch(
    CommonActions.reset({
      index: homeIndex,
      routes: state.routes.map((route) => {
        if (route.name === 'home' || route.key === focusedTab?.key) {
          return {
            key: route.key,
            name: route.name,
            state: { index: 0, routes: [{ name: 'index' }] },
          };
        }
        return route;
      }),
    })
  );
}

const navigation = {};

export default navigation;
