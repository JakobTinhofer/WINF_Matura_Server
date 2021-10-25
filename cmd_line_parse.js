var args = process.argv.slice(2);

for (let i = 0; i < args.length; i++){
    switch(args[i].toLocaleLowerCase()){
        case "--mongo":
        case "-m":
        case "--mongo-ip":
        case "-mip":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["MONGO_IP"] = args[i + 1];
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for mongo ip is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--debug":
        case "--dev":
        case "-d":
            console.log("Development mode enabled.");
            process.env["DEV_MODE"] = true;
            break;
        default:
            console.log("Unknown command line parameter: " + args[i]);
            process.exit(1);
   }
}
