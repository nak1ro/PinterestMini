export const parseApiError = (error) => {
    const response = error?.response;
    const data = response?.data;

    if (data?.error) return data.error;
    if (data?.title) return data.title;

    if (data?.errors) {
        return Object.values(data.errors).flat().join(' ');
    }

    return 'Unexpected error occurred.';
};
