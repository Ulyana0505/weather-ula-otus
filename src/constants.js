export const idList = "list";
export const citiesList = [];

export const requestDomain = {
  openWeather: "api.openweathermap.org",
  ipApi: "ipapi.co",
};

export function callIfTrue(flag, call) {
  const _flag = Boolean(flag);
  return _flag ? call : () => {};
}
