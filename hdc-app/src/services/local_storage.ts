export const loadSettingInteger = (key: string, defaultValue: number) => {
	const result = window.localStorage.getItem(key);
	return result ? parseInt(result, 10) : defaultValue;
};

export const loadSettingFloat = (key: string, defaultValue: number) => {
	const result = window.localStorage.getItem(key);
	return result ? parseFloat(result) : defaultValue;
};

export const loadSettingString = (key: string, defaultValue: string) => {
	const result = window.localStorage.getItem(key);
	return result ? result : defaultValue;
};

export const saveSettingNumber = (key: string, value: number) => {
	window.localStorage.setItem(key, '' + value);
};

export const saveSettingString = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};
