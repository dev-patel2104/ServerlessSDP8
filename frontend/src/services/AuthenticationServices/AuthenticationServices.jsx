export const isAuthenticated = () => {
    const user = localStorage.getItem('userType');
    if(user === 'user' || user === 'partner'){
        return true;
    }else{
        return false;
    }
}