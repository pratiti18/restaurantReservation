async function ovenResponse(){
    const ovenWait = await fetch("http://localhost:8080/users/ifOvensAvailable", {
        method: 'GET',
  })

  const ovenData = await ovenWait.json();
    return ovenData;

}

setInterval(async()=>{
    const ovenData = await ovenResponse();
    if(ovenData === false)
    {
        const pizzaReceiptUrl = "../pizzaReceipt/pizzaReceipt.html";
        window.location.replace(pizzaReceiptUrl);
        return ;
    }
}, 3000);