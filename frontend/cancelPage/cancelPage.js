function goBack(e){
    e.preventDefault();
    const homeUrl="../home/index.html";
    if(sessionStorage.getItem("bookingResponse"))
    {
        sessionStorage.removeItem('bookingResponse');
    }

        setTimeout(() => {
            window.location.replace(homeUrl);
        }, 1000);
}