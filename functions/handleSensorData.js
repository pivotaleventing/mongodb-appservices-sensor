exports = function(request){
  if(context.request.httpMethod === "POST" && request.body) {
    const body = EJSON.parse(request.body.text());
    console.log(EJSON.stringify(request.body.text()));
    const timestamp = Date.now();
    const device_id = body.esp8266id;
    const software_version = body.software_version;

    let collection = context.services.get("Cluster0").db("Cluster0").collection(device_id);
    
    let results = [];
    
    body.sensordatavalues.forEach((cur, idx, arr) => {
      let result = {};
      result.timestamp = timestamp;
      result.software_version = software_version;
      let tmp = cur.value_type.split("_");
      result.sensor = tmp[0];
      result.phenomenon = tmp[1] || "undefined";
      result.value = cur.value;
      results.push(result);
    });
    
    collection.insertMany(results);
    return "OK";
  }
  
};