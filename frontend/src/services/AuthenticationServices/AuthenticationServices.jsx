export const isAuthenticated = () => {
    const user = localStorage.getItem('foodvaganzaUser');
    if(user){
        return true;
    }else{
        return false;
    }
}