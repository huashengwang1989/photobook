# photobook

This is a project for my personal photobook pages generation. It is to serve the purpose of making photobook for kid's school life.

This app shall output a batch of images of individual pages, which can be uploaded to existing web-based photobook printing services to make physical photobooks. Alternatively, you may combine them to PDF by yourself and pass to offline printing company. This is NOT an online or digital photobook generator or presenter.

> Despite that it is meant for offline printing, pictures generated is still sRGB, and source images are also expected to be sRGB. Most online printing services also do not support other color profiles or handle them well. For offline printing, you may need convert to CMYK by yourself, based on individual printing company's requirement.

It generate pages for two parts:

- A. Monthly Calendar Pages, with school daily check in and and check out photos. For absent days or any day without photos, it support placeholder icons.

- B. Ad-hoc activity photos. One activity can have multiple pages. It support meta information on the first page, and arranging photos underneath the meta information and on subsequent pages.

> As this is auto-generation, currently it is programmed as maximum 2 photos underneath the meta information in the first page, and maximum 4 photos for subsequent pages for one activity. This is not configurable at current stage, though you may minor adjust them (see `pageAdjust.activity` in project config file. Refer to "Config Your Own Photobook Project" section for details).

## Background

This app is created based on picture files and information that can be extracted from LittleLives, which Singapore's PCF Sparkletots Preschool was using for parent-teacher communication and daily trackings. LittleLives itself offer functionality of batch photo download for both calendar part (individual month) and activity part (all photos for a period - you need re-organise them to individual activities).

For 2024 onwards, PCF Sparkletots has switched to customised app by Qoqolo. I will see how it can be updated to suit Qoqolo's context.

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

![Calendar Exported Image Sample](./demo/exported_images/calendar-2023-07_300_b.jpg "Calendar Exported Image Sample")

> For above demo, 24 Jul and 26 Jul are deliberately to omit the check-in / check-out photos respectively, to simulate the case that the system does not record one of them, for cases like system breakdown.

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

**LittleLives**: Above demonstrated image filenames is indeed the same filename format when you mass output the check-in and check-out images.

**Qoqolo**: There is no batch export function for Qoqolo. If you manually save each image by yourself (not recommended, very tedious), you need rename the image files as the default filename is a random string. (TODO: a python script to automatically extract check-in-out images and rename them in above format)

##### Activity

| Page 1 | Page 2 |
|--|--|
|![Activity Exported Image Sample Page 1](./demo/exported_images/activity-20230711-1-page_1_300_b.jpg "Activity Exported Image Sample - Page 1 of One Activity")|![Activity Exported Image Sample Page 2](./demo/exported_images/activity-20230711-1-page_2_300_b.jpg "Activity Exported Image Sample - Page 2 of One Activity")|

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

It is suggested to organise them ad-hocly, e.g. once a month, and proofreading yourself for the content to be included in README.md, instead of to have all to organise in one shot at the end of a year.

For each activity's folder, it is required to have date information included in the folder name, or that folder shall be omitted. The date format can be `yyyy_mm_dd` as above, or alternatively, `yyyy-mm-dd` or `yyyymmdd`. For other parts in folder name, they are for your own reference only. Title will only be extracted from README.md h2 (##) line.

For filenames of images, any name shall work (which the default filesnames from LittleLives are random strings). Howerver for activity, it is required to have a `README.md` for activity details and include it in the activity folder, so that program can display title, description etc. on the first page meta section. Filename must be `README.md`.

README file content format is as follows. Note that for h3 (###) headings, you need make it exactly the same as what is having below. For "Objectives", "Description" and "Developments", if you don't have the content, please leave "N.A." or empty. DO NOT leave "-" there as Markdown will treat it as a list.

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

Activity Timestamp: 2023-10-28 15:20
Publish Timestamp: 2023-10-31 19:54

```

For "Meta" part, it now consists of the three parts:

- Teacher: program will check the presence of "teacher:". If have multiples, split them with ",".

- Activity Timestamp and Publish Timestamp: timestamps are to display as is. If don't have the information, just omit the lines.

**Qoqolo Case**: Qoqolo system does not register activity timestamp. You may still manually deduce them if the image filenames contain the information, depending on teachers' device and software used in fact; if not the case, you may have to remove the "Activity Timestamp" line. Note that teacher may only upload photos a few days later after the event.

#### IDE

It is suggested to use VSCode. You may install related plugins for `prettier` and `tailwindCSS` etc.

### Current Status & Notes

This is a personal project, so there are a lot of hard-coded parts as well as practices based on personal habit. It is not meant for any generic solution -- at least not yet.

It is currently developed on Mac for Photobook with pages 20x20cm (8" x 8"). Despite that it is configurable at config files, other cases are not tried and tested. If you are making a lager squarish book, you may simply increase the DPI in the config files; however if your photobook is not square, please make sure that it is checked for each page's layout. I cannot guarantee that it will not overflow.

#### Calendar

You may take additional caution on calendars. Please check that the content does not overflow and exceed the border / bleeding marks (you may enable bleed marks at config files), especially for months that may cross 6 weeks' spans (aka. 6 rows). It is deliberate to have rows without any photo to have a smaller height.

A non-square horizontal book may also cause it to overflow; too-long texts in the cell may also result in so (depending on what you put for the labels in `configs.pageConfig.calendar.specialDays`). Perform final proof with exported images too, for the reason as stated in "Fonts" part below.

#### Fonts

Font is setup at `tailwind.config.ts` in root folder. Do check the export images, especially if you change the fonts.

Image generation is done via converting to canvas with existing library, and ligature for some fonts may not work properly or as expected at this part. This may make it less aesthetically appealing, and even overflows as letter spacing may be affected.
