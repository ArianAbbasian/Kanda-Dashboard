async function getFilteredUsers(page = 1, pageSize = 5) {
    const filters = window.filterState || {};
    const params = new URLSearchParams();

    if (filters.name) params.append('name', filters.name);
    if (filters.username) params.append('username', filters.username);
    if (filters.email) params.append('email', filters.email);
    if (filters.userType) params.append('userType', filters.userType);
    if (filters.provinceId) params.append('provinceId', filters.provinceId);
    if (filters.cityId) params.append('cityId', filters.cityId);

    params.append('page', page);
    params.append('pageSize', pageSize);

    const url = `/User/GetFilteredUsers?${params.toString()}`;

    const response = await fetch(url);
    return await response.json();
}