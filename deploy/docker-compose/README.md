## Peristent directory configuration

Make sure you fill the PERSISTENT_DIR in .env.api file, it will set directory where persistent directory is located inside container when run.

```sh
# .env.api
# Persistent directory location
# Default configuration is on /var/www/stageholder
# You can change this to your own directory
PERSISTENT_DIR=/var/www/stageholder
```

By default the docker compose mount the persistent directory on /var/www/stageholder  
You can create the directory in your deployment instance and allow for read/write

```sh
mkdir /var/www/stageholder
chmod 775 /var/www/stageholder
```

To make sure there is no data lost when container is shudown you can set volume in docker compose

```yaml
# docker-compose.yml
api:
  image: stageholder-api:latest
  ports:
    - "8080:8080"
  volumes:
    # Make sure the instance directory exist to mount the data
    - /var/www/stageholder:/var/www/stageholder
```

It will be better to try upload some image/file and check the data is persisted on the directory you desire before you consider the deployment is done 😉

## There is one more thing 🚀

You know that we can mount container image directory into our own instance persistent directory.  
That also mean you can integrate it with object storage such as Amazon s3, Google cloud storage and so on.  
All you have to do is just mount your object storage into your instance and configure the volume in docker compose linked your mounted directory.  
That's all 🔥

But how do we do it?  
Here is the following link may can help you:

- [How to mount S3 Bucket in Linux](https://cindercloud.com/index.php?rp=/knowledgebase/17/How-to-mount-S3-Bucket-in-Linux.html)
- [Mount a Cloud Storage bucket using Cloud Storage FUSE](https://cloud.google.com/storage/docs/gcsfuse-quickstart-mount-bucket)

What about Vultr?  
Vultr can works using s3 so, you can follow the tutorial related to s3.

Don't forget, the access right between apps and your mounted storage directory, sometime it can be a problem. cloud IAM and chmod 775 can be a solution 😉
