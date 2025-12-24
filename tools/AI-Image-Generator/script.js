const generateBtn = document.querySelector("#generate-btn");
const promptInput = document.querySelector("#prompt");
const aiImage = document.querySelector("#ai-image");
const loader = document.querySelector("#loader");

// আপনার বর্তমান টোকেন
const HF_TOKEN = "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"; 

async function query(data) {
    loader.style.display = "block";
    aiImage.style.opacity = "0.3";
    
    // আমি এখানে আরও উন্নত একটি মডেল (SDXL) ব্যবহার করছি যা দ্রুত ছবি দেয়
    const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
            headers: { 
                "Authorization": `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error("API Error: " + response.status);
    }

    const result = await response.blob();
    return result;
}

generateBtn.addEventListener("click", () => {
    const text = promptInput.value;
    if (!text) return alert("অনুগ্রহ করে কিছু লিখুন (Prompt)!");

    generateBtn.innerText = "Generating... Please Wait";
    generateBtn.disabled = true;

    query({ "inputs": text }).then((response) => {
        const objectURL = URL.createObjectURL(response);
        aiImage.src = objectURL;
        
        // ছবি লোড হলে স্টাইল ঠিক করা
        aiImage.onload = () => {
            loader.style.display = "none";
            aiImage.style.opacity = "1";
            generateBtn.innerText = "Generate Image";
            generateBtn.disabled = false;
        };
    }).catch(err => {
        console.error(err);
        alert("সমস্যা হয়েছে! টোকেন পারমিশনে 'Inference' অপশনটি চালু আছে তো?");
        loader.style.display = "none";
        aiImage.style.opacity = "1";
        generateBtn.innerText = "Generate Image";
        generateBtn.disabled = false;
    });
});
