var avgacc=0;
var tacc=0;
var u=0;
var v=0;
var n = 1;
var current=0;
var dischargeR = 0;
var lat=0;
var lon=0;


if (window.DeviceMotionEvent != undefined) {
 window.ondevicemotion = function(e) {
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;
  tacc=Math.sqrt(x*x + y*y + z*z);
        
 }
}
setTimeout(() => {
    avgacc + tacc;
    n=n+1;
    if(n==10)
    {
        var acc = avgacc/10;
        v = u + acc * 10;
        
    }
  },1000);

setTimeout(() => {
    var acc = avgacc/10;
    v = u + acc * 10;
    var mV = localStorage.getItem("motorVoltage");
    var bV = localStorage.getItem("batteryVoltage");
    var P =  localStorage.getItem("power");
    var w =  localStorage.getItem("weight");
    var e =  localStorage.getItem("effiiciency");
    var t = localStorage.getItem("time");

    if(tacc>0.5)
    {
        current = dischargeRate(x,y,z,v,u,w,e,t);
    }

    dischargeR += current;

  },10000);
  

setTimeout(() => {

    var charge = localStorage.getItem("currentpercentage"); 
    navigator.geolocation.getCurrentPosition(success,error);
    const success = (position) => {
        console. log(position)
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);
        
        }
    const error = () => { console.log("Error"); }        
    const data = {
        location:[lat,lon],
        chargep: (charge-dischargeR),
        dischargeR:dischargeR

    }
    fetch('http://192.168.238.204:3000/dischargeUpdate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      //  return response.json();
  })
  .then(data => {
      console.log('API Response:', data);
      // Optionally, you can handle the response here
  })
  .catch(error => {
      console.error('There was a problem with the API request:', error);
  });
},300000)



function dischargeRate(accelX,accelY,accelZ,motorVoltage,batteryVoltage,power,velocityCurrent,velocityPast,weight,efficiency,time)
{
    
    // let estVel = 100; //velocity assumed to be 100km/h
    // let distancePerkWh = 1000/efficiency;   // km covered after consuming 1kwh
    // let timeTakenPerkWh = distancePerkWh/100; // TIME IN HOURS
    // timeTakenPerkWh = timeTakenPerkWh*3600; // convert to seconds
    // let powerCalculations = 1000/timeTakenPerkWh; // How many Wh consumed persecond
    // let wattSeconds = powerCalculations*3600; // Power in WattSeconds
    // let cruiseCurrent = wattSeconds/motorVoltage;
    // console.log(cruiseCurrent);


   // console.log("amps drawn via mom "+ampMom);

    let air_density = 1.2
    let rolling_resistance_coefficient = 0.015


    let total_acceleration = Math.sqrt(accelX*accelX + accelY*accelY + accelZ*accelZ);
    console.log("Accel:"+total_acceleration)
    let drag_force = 0.5 * air_density * rolling_resistance_coefficient * velocityCurrent*velocityCurrent*2.2;
    console.log("Drag:"+drag_force)
    let total_force = total_acceleration * weight + drag_force;
    console.log("Total Force:"+total_force);


    let dist = (velocityCurrent*velocityCurrent-velocityPast*velocityPast)/(2*total_acceleration);
    let keDiff = 0.5*weight*((velocityCurrent*velocityCurrent)-(velocityPast*velocityPast));
    let pwr = keDiff/time;
    let current = pwr/motorVoltage;
    console.log("Current "+current)
    //let discharge_rate = (ws/motorVoltage)+ampMom;
    return current;

}

