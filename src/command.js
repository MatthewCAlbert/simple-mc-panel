class MinecraftServerCommand{
    constructor(callback=(err, stdout, stderr)=>console.log('a')){
        this.callback = callback;
        this.exec = require('child_process').exec;
    }
    restart(res, callback = this.callback){
        this.exec('systemctl restart minecraft', function(err, stdout, stderr) {
            callback(err, stdout, stderr);
            res.send({err:err, stdout:stdout, stderr:stderr})
        });
    }
    start(res, callback = this.callback){
        this.exec('systemctl start minecraft', function(err, stdout, stderr) {
            callback(err, stdout, stderr);
            res.send({err:err, stdout:stdout, stderr:stderr})
        });
    }
    stop(res, callback = this.callback){
        this.exec('systemctl stop minecraft', function(err, stdout, stderr) {
            callback(err, stdout, stderr);
            res.send({err:err, stdout:stdout, stderr:stderr})
        });
    }
    status(res, callback = this.callback){
        this.exec('systemctl status minecraft', function(err, stdout, stderr) {
            callback(err, stdout, stderr);
            res.send({err:err, stdout:stdout, stderr:stderr})
        });
    }
}

module.exports.msc = MinecraftServerCommand;