# image-service
Service to accept data url images and save them to images locally. Images can then be retrieved from service.


## Setup
Clone repo locally using `git clone https://github.com/MAHRIO/image-service.git` or download zip from [here](https://github.com/MAHRIO/image-service.git)

Use terminal and navigate to `image-service/` folder, then install module dependencies using `npm i`

After dependencies, run `node index`. Go to https://127.0.0.1:3010 to take a picture and upload.

## API
Upload image as data using following endpoint

`https://127.0.0.1:3010/upload` accepting `application/json` content-type with the following payload:

```
{
    file: 'data:image/png;base64, ... ',
    filename: 'filename-desired-with-extension.png',
    dataURL: true
}
```

The response 
```
{
    filename: 'filename-desired-with-extension.png`
}
```

After a file has been saved you can preview it from the server using:

`https://127.0.0.1:3010/images/filename-desired-with-extension.pmg`