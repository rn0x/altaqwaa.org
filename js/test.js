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

function initReleaseData(result) {
    // console.log("initReleaseData: ", result);
    let total64bit = 0;
    let total32bit = 0;
    let totaljar = 0;

    result.forEach(item => {
        if (item.assets.length) {
            console.log("------", item.name, "------");
            item.assets.forEach(asset => {
                console.log("Name:", asset.name, ", Number of Downlads:", asset.download_count);
                if (asset.name.indexOf("64") !== -1) {

                    total64bit += asset.download_count;
                }
                if (asset.name.indexOf("32") !== -1) {
                    total32bit += asset.download_count;
                }
                if (asset.name.indexOf("PortableJar_No-JRE") !== -1) {
                    totaljar += asset.download_count;
                }
            });
        }
    });
    console.log("------ Total ------");
    console.log("total64bit: " + total64bit);
    console.log("total32bit: " + total32bit);
    console.log("totaljar: " + totaljar);

    document.getElementById("win_exe64_counter").innerText = total64bit;
    document.getElementById("win_exe32_counter").innerText = total32bit;
    document.getElementById("jar_counter").innerText = totaljar;

    if (totaljar && total32bit && total64bit) {
        Array.from(
            document.getElementsByClassName("number-of-downloads")
        ).forEach((element, index, array) => {
            element.style.display = "inline";
        });
    }

}

/**
 * GET number of downloads for specific VersionNumber
 * @param {string} version
 */
function initNumberOfDownloads(version) {
    fetch(
        "https://api.github.com/repos/AbdelrahmanBayoumi/Azkar-App/releases/tags/" +
        version
    )
        .then((result) => result.json())
        .then((json) => {
            // console.log("data:", data);
            json.assets.forEach((asset) => {
                if (asset.name.indexOf("32") !== -1) {
                    document.getElementById("win_exe32_counter").innerText =
                        asset.download_count;
                } else if (asset.name.indexOf("64") !== -1) {
                    document.getElementById("win_exe64_counter").innerText =
                        asset.download_count;
                } else if (asset.name.indexOf("Jar") !== -1) {
                    document.getElementById("jar_counter").innerText =
                        asset.download_count;
                }
                console.log(
                    "Name:",
                    asset.name,
                    ", Number of Downlads:",
                    asset.download_count
                );
            });
            if (json.assets) {
                Array.from(
                    document.getElementsByClassName("number-of-downloads")
                ).forEach((element, index, array) => {
                    element.style.display = "inline";
                });
            }
        })
        .catch((error) => console.log("error", error));
}

