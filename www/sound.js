/*global LocalFileSystem, $, console, Media, DebugConsole */

/*
 * Jeremiah Bargar
 * jeremy
 */

// name of the file to be recorded
var RECORD_FILENAME = 'blank.wav';

// full path up to and including the file name
var RECORD_FILEPATH = null;

// jquery elements that serve as user controls
var PLAY_BUTTON;
var RECORD_BUTTON;
var CD_BUTTON;

function onBodyLoad() {

    'use strict';

    document.addEventListener("deviceready", onDeviceReady, false);
}

/* When this function is called, Cordova has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
 see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
 for more details -jm */
function onDeviceReady() {

    'use strict';

    PLAY_BUTTON = $('#play-button');
    RECORD_BUTTON = $('#record-button');
    CD_BUTTON = $('#cd-button');

    console.log('onDeviceReady sound test');
}

// internal functions - in a more robust app, these would be hidden
// see bottom for 'external api'.

function deleteBlank() {

    'use strict';

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsForDelete, logError);
}

function deleteRecording() {

    'use strict';

    if(navigator.audio) {
        console.log("resetting audio - removing blank...");
        deleteBlank();
    } else {
        alert("Touch the record button to record a voice memo.");
    }
}

function startRecord() {

    'use strict';

    console.log("start record...");
    if(navigator.audio && confirm("Delete existing recording?")) {
        deleteRecording();
        return;
    }

    // first, we need to recreate the wav file
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFsForCreate, logError);
}
function stopRecord() {

    'use strict';

    console.log("Stopping recording...");
    RECORD_BUTTON.val('RECORD');
    CD_BUTTON.val('DELETE');
    navigator.audio.stopRecord();
}

function playRecord() {

    'use strict';

    console.log("Playing recording...");
    if(navigator.audio) {
        PLAY_BUTTON.val('STOP');
        navigator.audio.play();
    } else {
        alert("No audio. Touch the record button to record some.");
    }
}

function stopPlayback() {

    'use strict';

    console.log("Stopping playback...");
    PLAY_BUTTON.val('PLAY');
    navigator.audio.stop();
}

function recording_success() {

    'use strict';

    console.log("Recording success callback");
    RECORD_BUTTON.val('RECORD');
    PLAY_BUTTON.val('PLAY');
    CD_BUTTON.val('DELETE');
}

function recording_failure(error) {

    'use strict';

    alert("Recording failed: " + error);
    console.log("Recording failed: " + error);
}

function gotFsForCreate(fileSystem) {

    'use strict';

    if (!RECORD_FILEPATH) {

        RECORD_FILEPATH = fileSystem.root.fullPath + '/' + RECORD_FILENAME;
        console.log('noting record file path as: ' + RECORD_FILEPATH);
    }

    fileSystem.root.getFile(RECORD_FILEPATH, {create: true}, function() {
        console.log('created wav file');
        console.log("Initializing audio...");
        navigator.audio = new Media(RECORD_FILEPATH,recording_success,recording_failure);
        console.log("Initializing audio...OK");
        CD_BUTTON.val('SAVED');
        RECORD_BUTTON.val('STOP');
        console.log("Starting recording...");
        navigator.audio.startRecord();
        console.log("Starting recording...OK");
    }, logError);
}

function gotFsForDelete(fileSystem) {

    'use strict';

    fileSystem.root.getFile(RECORD_FILEPATH, {create: false}, deleteFileEntry, logError);
}

function deleteFileEntry(fileEntry) {

    'use strict';

    fileEntry.remove(function() {

        console.log("Removal succeeded");
        navigator.audio = null;
        CD_BUTTON.val('HELP');
    }, function(error) {

        console.log('Error removing file: ' + error.code);
    });
}

function logError(error) {

    'use strict';

    console.log('something failed: ' + JSON.stringify(error));
}

// 'external api' functions called by controls

function recordButtonClicked() {

    'use strict';

    if(RECORD_BUTTON.val() === 'STOP') {
        stopRecord();
    } else {
        startRecord();
    }
}

function playButtonClicked() {

    'use strict';

    if (PLAY_BUTTON.val() === 'PLAY') {
        playRecord();
    } else {
        stopPlayback();
    }
}

function cdButtonClicked() {

    'use strict';

    if(CD_BUTTON.val() === 'HELP') {

        alert("Touch the record button to record a voice memo.");
    } else {

        if(confirm("Really delete audio recording?")) {
            deleteRecording();
        }
    }
}

/**
 * Play back the indicated resource, independent of the other record/play functions.
 *
 * @param resource static resource relative to www directory
 */
function playWav(resource) {

    'use strict';

    console.log('playWav(' + resource + ')...');
    new Media(resource).play();
    console.log('playWav(' + resource + ')...OK');
}
