const generateBtn = document.querySelector("#generate-btn");
const promptInput = document.querySelector("#prompt");
const aiImage = document.querySelector("#ai-image");
const loader = document.querySelector("#loader");

// আপনার Hugging Face API Token এখানে দিন
const HF_TOKEN = "Hf_WjeWhmSdIhUWyjUESiaXmChSklNyjfFmPd"; 

async function query(data) {
    loader.style.display = "block";
    aiImage.style.opacity = "0.5";

    const response = await fetch(
        "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
        {
            headers: { Authorization: `Bearer ${HF_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.blob();
    return result;
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
        alert("Error generating image. Check your Token!");
        loader.style.display = "none";
    });
});
