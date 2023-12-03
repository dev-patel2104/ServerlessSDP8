export const isAuthenticated = () => {
    return localStorage.getItem('userType');
}