const generateBtn = document.querySelector("#generate-btn");
const promptInput = document.querySelector("#prompt");
const aiImage = document.querySelector("#ai-image");
const loader = document.querySelector("#loader");

// আপনার টোকেনটি এখানে আছে
const HF_TOKEN = "Hf_WjeWhmSdIhUWyjUESiaXmChSklNyjfFmPd"; 

async function query(data) {
    loader.style.display = "block";
    aiImage.style.opacity = "0.5";

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            {
                headers: { 
                    "Authorization": `Bearer ${HF_TOKEN}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        // যদি টোকেন বা পারমিশনে সমস্যা থাকে তবে এখানে ধরা পড়বে
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API Error");
        }

        const result = await response.blob();
        return result;
    } catch (error) {
        console.error("Error Detail:", error);
        throw error;
    }
}

generateBtn.addEventListener("click", () => {
    const text = promptInput.value;
    if (!text) return alert("Please enter a description!");

    query({ "inputs": text }).then((response) => {
        const objectURL = URL.createObjectURL(response);
        aiImage.src = objectURL;
        loader.style.display = "none";
        aiImage.style.opacity = "1";
    }).catch(err => {
        // এরর মেসেজটি অ্যালার্টে দেখাবে
        alert("Error: " + err.message + ". \nটোকেন পারমিশনে 'Inference' চেক করেছেন তো?");
        loader.style.display = "none";
        aiImage.style.opacity = "1";
    });
});
