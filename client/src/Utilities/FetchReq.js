const FetchReq = async (post, url, body) => {
    let returnData;
    if (post) {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success || Array.isArray(data)) {
                    returnData = data;
                } else {
                    alert(
                        `Something went wrong, please try again! ${JSON.stringify(
                            data
                        )}`
                    );
                }
            });
    } else {
        await fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
                if (data.success || Array.isArray(data)) {
                    returnData = data;
                } else {
                    alert(
                        `Something went wrong, please try again! ${JSON.stringify(
                            data
                        )}`
                    );
                }
            });
    }
    return returnData;
};

export default FetchReq;
