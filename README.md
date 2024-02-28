# photobook

This is a project for my personal photobook pages generation. It is to serve the purpose of making photobook for kid's school life.

It generate pages for two parts:

- A. Monthly Calendar Pages, with school daily check in and and check out photos. For absent days or any day without photos, it support placeholder icons.

- B. Ad-hoc activity photos. One activity can have multiple pages. It support meta information on the first page, and arranging photos underneath the meta information and on subsequent pages.

> As this is auto-generation, currently it is programmed as maximum 2 photos underneath the meta information in the first page, and maximum 4 photos for subsequent pages for one activity. This is not configurable at current stage, though you may minor adjust them (see `pageAdjust.activity` in project config file. Refer to "Config Your Own Photobook Project" section for details).

## Kick Start

### Rust

This project is based on `tauri`, which relies on `rust`.
 
Install `rust` or update it to latest version if you have installed previously. If you installed via `brew`, do `brew update`.

### Run at Terminal

```
npm install
npm run tauri dev
```

It should directly open tauri app.

Note that if you run `npm run dev`, you may still open it in browser `http://localhost:5173/`. However, as browser cannot directly retrieve files from local drive, that functionality is based on Tauri, and running from browser won't work.

### Config Your Own Photobook Project

Please navigate to `/src/projects` folder. Duplicate `demo_project.config.ts` and make your own file. Update `index.ts` thereafter.

#### Organize Your Photos and Meta Files

You are required to pre-organise them in the following manner. For each project, you should have one folder for "Calendar" part, and one folder for "Activity" part. These folder paths (aka. baseFolder) is configurable in the project config file.

> This program is done on Mac. Windows case is not tested.

##### Calendar

For Calendar photos, the image files need have name in `yyyy-mm-dd-in.jpg` or `yyyy-mm-dd-out.jpg` format. Program needs be able to extract the date and "in/out" information from the file-name.

It is recommended to do in the following way:

```
+ My Kid's 2023 Check-in Check-out Photos
  + 2023-01
    - 2023-01-02-in.jpg
    - 2023-01-02-out.jpg
    - 2023-01-03-in.jpg
    - 2023-01-03-out.jpg
    - ...
  + 2023-02
    - ...
    - ...
```

Filename format parsing is not included in the project config file (as it is meant to be exportable to json in the future). You may refer to `/src/partials/CanvasMulti/configs/calendar.ts` if you need update it.

##### Activity

For activity photos, images are required to organised in sub-folders based on activities:

```
+ My Kid's 2023 Activity Photos
  + 2023_01_10 Activity 1
    - activity_1_photo_1.jpg
    - activity_1_photo_2.jpg
    - activity_1_photo_3.jpg
    - ...
    - README.md
  + 2023_01_21 Activity 2
    - activity_1_photo_1.jpg
    - activity_1_photo_2.jpg
    - README.md
  + ...
  + ...
```

For each activity's folder name, it is required to have date information included in the folder name, or that folder shall be omitted. The date format can be `yyyy_mm_dd` as above, or `yyyy-mm-dd` or `yyyymmdd`.

For photos' filename, it can be any name (which the default filesnames from my school's system is random strings). Howerver for activity, it is required to have a `README.md` for activity details, so that program can display title, description etc. on the first page meta section.

README file content format as follows. Note that for h3 (###) headings, you need have it exactly the same as what is having below. For "Objectives", "Description", "Developments", if you don't have the content, please leave "N.A." or empty. DO NOT leave "-" there as Markdown will treat it as a list.

```md

## My Activity Title

### Objectives

After the activity, my kid will be able to do xxx.

### Description

The teacher will demonstrate .....

### Developments

(EY) Social & Emotional Development
(EY) Early Language and Pre-Literacy Development

### Meta

Xxx Teacher: Teacher A, Teacher B

Activity Timestamp: 2023-10-31 15:20
Publish Timestamp: 2023-10-31 19:54

```

For "Meta" part, it now consists of the three parts:

- Teacher: program will check the presence of "teacher:". If have multiples, split them with "," or newline.

- Activity Timestamp and Publish Timestamp: they are to display as is. If don't have the information, just omit the lines.


#### IDE

It is suggested to use VSCode. You may install related plugins for `prettier` and `tailwindCSS` etc.

### Current Status

This is a personal project, so there are a lot of hard-coded, and practices based on personal habit. It is not meant for any generic solution -- at least not yet.

It is currently developed on Mac for Photo Album with pages 20x20cm. Despite that it is configurable at config files, other cases are not tried and tested.