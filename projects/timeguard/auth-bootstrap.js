(() => {
  const PROFILE_KEY = 'timeguard_profile_v1';

  function readProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  function currentRole() {
    return readProfile()?.role || 'guest';
  }

  function currentPlan() {
    return readProfile()?.plan || 'free';
  }

  window.TimeGuardAuth = { readProfile, saveProfile, currentRole, currentPlan };
})();
