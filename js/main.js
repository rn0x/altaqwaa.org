let releases = document.getElementById("releases");
let download = document.getElementById("download");
let features_ul = document.getElementById("features_ul");
let download_ul = document.getElementById("download_ul");
let logo = document.getElementById("logo");

download.addEventListener("click", e => {
    download_ul.scrollIntoView();
});

logo.addEventListener("click", e => {
    window.location.href = "/";
});


const dataDesktop = await getReleasesData("rn0x", "Altaqwaa-Islamic-Desktop-Application");
const dataAndroid = await getReleasesData("Alsarmad", "altaqwaa_android");

let down_win_exe_setup = NumberOfDownloads(dataDesktop, "setup");
let down_win_exe_portable = NumberOfDownloads(dataDesktop, "portable");
let down_win_msi = NumberOfDownloads(dataDesktop, ".msi");
let down_linux_rpm = NumberOfDownloads(dataDesktop, ".rpm");
let down_linux_deb = NumberOfDownloads(dataDesktop, ".deb");
let down_linux_snap = NumberOfDownloads(dataDesktop, ".snap");
let down_linux_flatpak = NumberOfDownloads(dataDesktop, ".flatpak");
let down_linux_AppImage = NumberOfDownloads(dataDesktop, ".AppImage");
let down_android_apk = NumberOfDownloads(dataAndroid, ".apk");
let link_win_exe_setup = getLinkDownload(dataDesktop, "setup");
let link_win_exe_portable = getLinkDownload(dataDesktop, "portable");
let link_win_msi = getLinkDownload(dataDesktop, ".msi");
let link_linux_rpm = getLinkDownload(dataDesktop, ".rpm");
let link_linux_deb = getLinkDownload(dataDesktop, ".deb");
let link_linux_flatpak = getLinkDownload(dataDesktop, ".flatpak");
let link_linux_AppImage = getLinkDownload(dataDesktop, ".AppImage");
let link_linux_snap = getLinkDownload(dataDesktop, ".snap");
let link_android_apk = getLinkDownload(dataAndroid, ".apk");

Download("download_windows_exe_setup", "package_windows_exe_setup", link_win_exe_setup, down_win_exe_setup);
Download("download_windows_exe_portable", "package_windows_exe_portable", link_win_exe_portable, down_win_exe_portable);
Download("download_windows_msi", "package_windows_msi", link_win_msi, down_win_msi);
Download("download_linux_flatpak", "package_linux_flatpak", link_linux_flatpak, down_linux_flatpak);
Download("download_linux_AppImage", "package_linux_AppImage", link_linux_AppImage, down_linux_AppImage);
Download("download_linux_rpm", "package_linux_rpm", link_linux_rpm, down_linux_rpm);
Download("download_linux_deb", "package_linux_deb", link_linux_deb, down_linux_deb);
Download("download_android_apk", "package_android_apk", link_android_apk, down_android_apk);



// Functions

function Download(elementDown, elementPKG, link, numbersDown) {

    let down = document.getElementById(elementDown);
    let pkg = document.getElementById(elementPKG);

    pkg.addEventListener("click", e => {
        window.open(link, "_blank");
    });

    down.innerText = numbersDown;

}

(async function newUpdate() {

    const updateInfo = document.getElementById("update_info");
    if (updateInfo) {
        // console.log("update page.")
        try {
            const query = window.location.search;
            const urlParams = new URLSearchParams(query);
            const repo = urlParams.get("repo") || "desktop";
            const version = urlParams.get("version") || "0.0.0";
            version == "0.0.0" ? window.location.href = "/" : false;

            updateInfo.innerHTML = "الإصدار المستخدم: " + version

            if (repo == "android") {
                let data = dataAndroid;
                if (version == data[0].tag_name.substring(1)) {
                    window.location.href = "/"
                } else {
                    updateInfo.innerHTML = "الإصدار المستخدم: " + version + " الإصدار الأخير: " + data[0].tag_name.substring(1)
                    releases.addEventListener("click", e => {
                        window.location.href = "https://github.com/Alsarmad/altaqwaa_android/releases"
                    });
                }
            } else {
                let data = dataDesktop;
                if (version == data[0].tag_name.substring(1)) {
                    window.location.href = "/"
                } else {
                    updateInfo.innerHTML = "الإصدار المستخدم: " + version + " الإصدار الأخير: " + data[0].tag_name.substring(1)
                    releases.addEventListener("click", e => {
                        window.location.href = "https://github.com/rn0x/Altaqwaa-Islamic-Desktop-Application/releases"
                    });
                }
            }

        } catch (error) {
            console.log(error)
        }
    } // else {
    // console.log("Not in update page.")
    // }
})();

async function getReleasesData(user, repo) {
    try {
        const result = await fetch(`https://api.github.com/repos/${user}/${repo}/releases`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
        return new Promise(function (resolve, reject) {
            resolve(result);
        });
    } catch (error) {
        return new Promise(function (resolve, reject) {
            reject(error);
        });
    }
}

function NumberOfDownloads(result, search) {

    let download_count = 0;

    result.forEach(item => {

        if (item?.assets?.length) {

            // console.log("------", item.name, "------");

            item?.assets.forEach(asset => {


                if (asset?.name?.toLowerCase()?.includes(search?.toLowerCase())) {

                    //  console.log("Name:", asset?.name, ", Number of Downlads:", asset?.download_count);

                    download_count += asset?.download_count;
                }
            });
        }
    });

    return download_count
}

function getLinkDownload(result, search) {

    for (let item of result?.[0]?.assets) {

        if (item?.name?.toLowerCase()?.includes(search?.toLowerCase())) {

            return item?.browser_download_url;

        }
    }

}