const clear_data();
reset all state       
        
const post_form_data = async (data) => {
    SetLoading(true);
    try {
        const response = await fetch(`https://bi.meraplion.com/local/post_data/<INSERT_NAME>/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.log(errorData);
            SetALert(true);
            SetALertType("danger");
            SetALertText(errorData.error_message);
            setTimeout(() => {
                SetALert(false);
                SetLoading(false);
            }, 2000);

        } else {
            const successData = await response.json();
            console.log(successData);
            SetALert(true);
            SetALertType("success");
            SetALertText(successData.success_message);
            setTimeout(() => {
                SetALert(false);
                SetLoading(false);
            }, 2000);
            
            clear_data();
        }
    } catch (error) {
        console.error("Fetch error:", error);
        }
};