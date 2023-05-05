let button = document.getElementById("btn");
let dataDiv = document.querySelector(".data");
let mapDiv = document.querySelector(".map");
let timeDiv = document.querySelector(".timeZone");
let officeDiv = document.querySelector(".office");
let searchbar = document.querySelector("#filter");
let message =  document.getElementsByClassName("message");
let postOffices = [];
let pin = 000000;
let useripaddress = "";

button.addEventListener("click", ()=>{
    button.style.display = "none";
    fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("heading").textContent += ` ${data.ip}`;
        useripaddress = data.ip;
        getLocation(useripaddress);
      })
      .catch((error) => {
        console.log(error);
      });

  })
  
  function getLocation(ip) {
    fetch(`https://ipinfo.io/${ip}/geo?token=6370439e94bf29`) 
      .then((response) => response.json())
      .then((data) => {
        let lat = data.loc.split(",")[0];
        let lon = data.loc.split(",")[1];
        console.log(data);
        dataDiv.innerHTML = `
        <div><div><h4>Lat:  ${lat}</h4></div> <div><h4>Long:  ${lon}</h4></div> </div>
        <div><div><h4>City:  ${data.city}</h4></div> <div><h4>Region:  ${data.region}</h4></div> </div>
        <div><div><h4>Organisation:  ${data.org}</h4></div> <div><h4>Hostname:  ${data.org}</h4></div> </div>
        `;

        pin = data.postal;

       
        displayMap(lat, lon);
        getPostOffices(pin);
        getTime(data.timezone);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function displayMap(latitude, longitude) {
    const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&output=embed`;
    const iframe = document.createElement("iframe");
    iframe.setAttribute("src", mapUrl);
    iframe.setAttribute("width", "100%");
    iframe.setAttribute("height", "500");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("style", "border:0");

    mapDiv.appendChild(iframe);
  }

  function getPostOffices(zip) {
    searchbar.style.display = "block";
    fetch(`https://api.postalpincode.in/pincode/${zip}`)
      .then((response) => response.json())
      .then((data) => {
        postOffices = data[0].PostOffice;
        printpostoffices(postOffices);
        
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function getTime(timezone) {
    fetch(`http://worldtimeapi.org/api/timezone/${timezone}`)
      .then((response) => response.json())
      .then((data) => {
        let time = new Date(
          data.datetime
        ).toLocaleTimeString();
        let date = new Date(
            data.datetime
          ).toLocaleDateString();
          
        timeDiv.innerHTML = `
        <div><h4>Time Zone: ${data.timezone}</h4></div>
        <div><h4>Date And Time: ${date} ${time} </h4></div>
        <div><h4>Pincode: ${pin}</h4></div>
        <div class="message"><h4 style="display:inline">Message:</h4> Number of pincode(s) found:</div>
        `

      })
      .catch((error) => {
        console.log(error);
      });
  }

  function printpostoffices(postoffices){
    let str = "";
    for(let postoffice of postoffices){
       str+= `
       <div class="postoff">
       <span>Name: ${postoffice.Name}</span>
       <span>Branch Type: ${postoffice.BranchType}</span>
       <span>Delivery Status: ${postoffice.DeliveryStatus}</span>
       <span>Block: ${postoffice.Block}</span>
       <span>District: ${postoffice.District}</span>
       <span>Division: ${postoffice.Division}</span>       
       </div>
       `;
    }

    document.querySelector(".post-ff-cont").innerHTML = str;
}

searchbar.addEventListener("input", ()=>{
   
    let inpstr = searchbar.value.toLowerCase().trim();
   
    let filterarray = [];

    filterarray = postOffices.filter((postoffice)=>{
        return (postoffice.Name.toLowerCase().includes(inpstr) || postoffice.BranchType.toLowerCase().includes(inpstr)
                 || postoffice.Block.toLowerCase().includes(inpstr) || postoffice.District.toLowerCase().includes(inpstr));
    });

    printpostoffices(filterarray);
});


 


