//Get icons from icons8.com
const categoryNav = document.querySelector('.categoryList');
const videoList = document.querySelector('#videoList');

//load category
function loadCategories() {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
}

// load videos
function loadVideos(searchResult = "") {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchResult}`)
        .then(res => res.json())
        .then(data => displayVideos(data.videos))
        .catch((error) => console.log(error))
}

//display category
function displayCategories(categories) {
    categories.forEach(category => {
        const btnContainer = document.createElement('div')
        btnContainer.innerHTML =
        `
            <button class="btn" onClick="categorizedVideos(${category.category_id})" id="btn-${category.category_id}">
                ${category.category}
            </button>
        `;

        categoryNav.append(btnContainer);
    })
}

//display videos
// object-cover class in img tag will auto adjust image in the field without stretching it
function displayVideos(videos) {
    videoList.innerHTML = "";

    if(videos.length == 0){
        videoList.classList.remove('grid');
        videoList.innerHTML = 
            `
                <div class="min-h-[300px] flex flex-col gap-5 justify-center items-center">
                    <img src="assets/icon.png"/>
                    <h2 class="text-xl font-bold">No content available for this category</h2>
                </div>
            `;
        return;
    }else{
        videoList.classList.add('grid');
    }

    videos.forEach(video => {
        const card = document.createElement('div')
        card.classList = 'card card-compact'
        card.innerHTML = 
        `
            <figure class="h-[200px] relative">
                <img src="${video.thumbnail}" alt="${video.title}" class="h-full w-full object-cover"/>
                ${video.others.posted_date?.length  == 0 ? "" : `<span class="absolute right-2 bottom-2 bg-black text-white rounded text-xs px-1">${getTimeString(video.others.posted_date)}</span>`}
            </figure>
            <div class="py-2 px-0 flex gap-2">
                <div>
                    <img src="${video.authors[0].profile_picture}" alt="${video.authors[0].profile_name}" class="w-10 h-10 rounded-full object-cover"/>
                </div>
                <div>
                    <h2 class="font-bold">${video.title}</h2>
                    
                    <div class="flex items-center gap-2">
                        <p class="text-gray-400">${video.authors[0].profile_name}</p>

                        ${video.authors[0].verified === true ? '<img src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" class="w-5"/>' : ""}
                    </div>
                    
                    <p>
                        <button class="btn btn-sm btn-error" onClick="loadDetails('${video.video_id}')">Details</button>
                    </P>
                </div>
            </div>
        `;
        videoList.append(card);
    })
}

function getTimeString(seconds){
    const hours = parseInt(seconds/3600);
    var remainderSeconds = seconds%3600;
    const minutes = parseInt(remainderSeconds/60);
    seconds = remainderSeconds % 60;

    return `${hours} hour ${minutes} minute ${seconds} seconds ago`
}

function categorizedVideos(category_id){
    fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${category_id}`)
        .then(res => res.json())
        .then(data => {
            removeActiveClass();
    
            const activeBtn = document.getElementById(`btn-${category_id}`);
            activeBtn.classList.add('activeCategory');
            displayVideos(data.category);
        })
}

const removeActiveClass = () => {
    const activeButtons = document.querySelectorAll('.btn');
    for(let btn of activeButtons){
        btn.classList.remove('activeCategory');
    }
};

const loadDetails = async (video_id) => {
    const data = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${video_id}`);
    const detail = await data.json();
    displayDetails(detail.video);
};

const displayDetails = (videoObj) => {
    const detailContainer = document.querySelector('#display-details');
    document.querySelector('#modalButton').click();

    detailContainer.innerHTML = `
        <img src='${videoObj.thumbnail}' alt='${videoObj.title}'/>
        <p>${videoObj.description}</p>
    `;
}

document.querySelector('.search-input').addEventListener('keyup', (e) => {
    loadVideos(e.target.value);
});

window.addEventListener('load', loadCategories);
// window.addEventListener('load', loadVideos);//This will throw an error, cause it'll load the function after reading the full
loadVideos();
