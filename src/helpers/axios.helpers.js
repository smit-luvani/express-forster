const Axios = require('axios').default;
const APIPost = ({ url, data, params, headers, timeout, timeoutErrorMessage }) => Axios.post(url, data, { params, headers, timeout, timeoutErrorMessage });
const APIGet = ({ url, params, headers, timeout, timeoutErrorMessage }) => Axios.get(url, { params, headers, timeout, timeoutErrorMessage });
const APIPut = ({ url, data, params, headers, timeout, timeoutErrorMessage }) => Axios.put(url, data, { params, headers, timeout, timeoutErrorMessage });
const APIDelete = ({ url, params, headers, timeout, timeoutErrorMessage }) => Axios.delete(url, { params, headers, timeout, timeoutErrorMessage });
const ErrorParser = (error) => {
	if (error?.response?.data) {
		return error.response.data;
	} else if (error?.response) {
		return error.response;
	} else {
		return error;
	}
};
module.exports = {
	APIPost,
	APIGet,
	APIPut,
	APIDelete,
	ErrorParser,
};
