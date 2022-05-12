departments = { "none" : false,
"american-decorative-arts" : 1,
"ancient-near-eastern-art" : 3,
"arms-and-armor" : 4, 
"arts-of-africa,-oceania,-and-the-americas" : 5,
"asian-art" : 6,
"the-cloisters" : 7,
"the-costume-institute" : 8,
"drawings-and-prints" : 9,
"egyptian-art" : 10, 
"european-paintings" : 11, 
"european-sculpture-and-decorative-arts" : 12,
"greek-and-roman-art" : 13,
"islamic-art" : 14, 
"the-robert-lehman-collection" : 15,
"the-libraries" : 16,
"medieval-art" : 17,
"musical-instruments" : 18,
"photographs" : 19,
"modern-art" : 21 }

let url = "https://collectionapi.metmuseum.org/public/collection/v1/search?"

document.querySelector('#departments').addEventListener('change', function() { 
  url = "https://collectionapi.metmuseum.org/public/collection/v1/search?"
//   url = `${url}${departmentIdRequest}`
  if (this.value) {
    departmentIdRequest = `departmentId=${departments[this.value]}&`
    url = `${url}${departmentIdRequest}`
  }
  // console.log(url)
})

// const searchUrl = "https://collectionapi.metmuseum.org/public/collection/v1/search?"
const input = document.querySelector('input')
// const query = `q=${input.value}`

let count = 0

// Changed this below
document.addEventListener('submit', async (e) => {
  console.log('hello')
  console.log(e.target.value)
  count = 0
  e.preventDefault()
  removeMySlides()
  let query = `q=${input.value}`
  // fetch(`${url}${query}`) 
  //   .then(res => res.json())
  //   .then(data => {
  //     data.objectIDs.forEach(item => fetchDataFromID(item))
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   })
  const jsonPromise = await fetchData(`${url}${query}`)
  jsonPromise.objectIDs.forEach(item => fetchDataFromID(item))
})

async function fetchData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`)
    }
    const json = await response.json()
    return json
  }
  catch (error) {
    console.error(`Could not fetch: ${error}`)
  }
}  

function fetchDataFromID(item) {
  const objectURL = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${item}`
  fetch(objectURL)
  .then(res => res.json())
  .then(data => {
    if (data.isPublicDomain) {
      createMySlides(data)
      count += 1
      // console.log(count)
      document.querySelector('#results').textContent = `${count} total entries found`
    }
  })
  .catch(err => {
    console.error(err);
  })  
}

function createMySlides(data) {
  const div = document.createElement('div')
  div.classList.add('slide','flow')
  document.getElementById("art-container").appendChild(div);
  div.appendChild(createLinkedImg(data))
  div.appendChild(createTitle(data))
  div.appendChild(createArtist(data))
  div.appendChild(createDept(data))
}

function createImages(data) {
  const img = document.createElement('img')
  img.classList.add('flow')
  img.src = data.primaryImageSmall
  return img
}

function createLinkedImg(data) {
  const objectUrl = document.createElement('a')
  objectUrl.classList.add('flow')
  objectUrl.href = data.objectURL
  objectUrl.appendChild(createImages(data))
  return objectUrl
}

function createArtist(data) {
  const artist = document.createElement('p')
  artist.classList.add('artist','flow')
  artist.textContent = data.artistDisplayName
  return artist
}

function createTitle(data) {
  const title = document.createElement('h3')
  title.classList.add('title','flow')
  title.textContent = data.title
  return title
}

function createDept(data) {
  const dept = document.createElement('p')
  dept.classList.add('department','flow')
  dept.textContent = data.department
  return dept
}

function removeMySlides() {
  document.querySelectorAll('.slide').forEach(item => item.remove())
}