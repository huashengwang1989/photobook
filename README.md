# photobook
For my personal photobook page generation

## Kick Start

### Rust

This project is based on `tauri`, which relies on `rust`.
 
Install `rust` or update it to latest version if you have installed previously. If you installed via `brew`, do `brew update`.

### Kick Start

```
npm install
npm run tauri dev
```

It should directly open tauri app.

Note that if you run `npm run dev`, you may still open it in browser `http://localhost:5173/`. However, as browser cannot directly retrieve files from local drive, that functionality is based on Tauri, and running from browser won't work.

#### IDE

It is suggested to use VSCode. You may install related plugins for `prettier` and `tailwindCSS` etc.

### Current Status

This is a personal project, so there are a lot of hard-coded, and practices based on personal habit. It is not meant for any generic solution -- at least not yet.

It is currently developed on Mac for Photo Album with pages 20x20cm. Despite that it is configurable at config files, other cases are not tried and tested.