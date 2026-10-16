function isUserLoggedIn() {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("earn_auth="));

  return cookie?.split("=")[1] === "authenticated";
}

function earnAuthBoot() {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const getStartedButton = document.getElementById("get-started-button");

  logoutButton?.addEventListener("click", () => {
    document.cookie = "earn_auth=; Max-Age=0; path=/; SameSite=Lax";
    nonAuthenticatedState();
    window.location.reload();
  });

  function nonAuthenticatedState() {
    getStartedButton?.classList.remove("hidden");
    loginButton?.classList.remove("hidden");
    logoutButton?.classList.add("hidden");
  }

  function authenticatedState() {
    getStartedButton?.classList.add("hidden");
    loginButton?.classList.add("hidden");
    logoutButton?.classList.remove("hidden");
  }

  if (isUserLoggedIn()) {
    authenticatedState();
  } else {
    nonAuthenticatedState();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", earnAuthBoot);
} else {
  earnAuthBoot();
}
