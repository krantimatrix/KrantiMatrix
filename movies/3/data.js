// এই ফাইলটি আপনার মুভি ডাটাবেস হিসেবে কাজ করবে
const movies = [
    {
        id: 1,
        title: "The Matrix Resurrections",
        category: "Action Sci-Fi",
        year: "2021",
        rating: "8.7",
        maturity: "18+",
        desc: "Plagued by strange memories, Neo's life takes an unexpected turn when he finds himself back inside the Matrix.",
        poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
        trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
        trailer_mp4: "https://archive.org/download/mt-15-share-yamaha-mt-15-lovers-mention-your-story-mt-15-lovers-rohiiittt-2621/%F0%9F%A5%80MT15%20%F0%9F%98%8D%20share%20yamaha%20MT15%20lovers%20mention%20your%20story%20MT15%20lovers%20%F0%9F%92%95%E2%9D%A4%EF%B8%8F%E2%80%8E%40rohiiittt_2621.mp4",
        trailer_embed: "https://archive.org/embed/TheMatrix1999Trailer",
        languages: {
            "English": { 
                mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4", 
                embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343." 
            },
            "Hindi": { mp4: "", embed: "https://archive.org/embed/TheMatrix1999Trailer" }
        }
    },
    {
        id: 2,
        title: "Yamaha MT 15 Adventure",
        category: "Short Film",
        year: "2025",
        rating: "9.2",
        maturity: "All",
        desc: "An exciting showcase for Yamaha MT15 lovers, capturing the thrill of the ride.",
        poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png", // আপনি চাইলে এখানে নতুন পোস্টার লিঙ্ক দিতে পারেন
        trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
        trailer_mp4: "https://archive.org/download/mt-15-share-yamaha-mt-15-lovers-mention-your-story-mt-15-lovers-rohiiittt-2621/%F0%9F%A5%80MT15%20%F0%9F%98%8D%20share%20yamaha%20MT15%20lovers%20mention%20your%20story%20MT15%20lovers%20%F0%9F%92%95%E2%9D%A4%EF%B8%8F%E2%80%8E%40rohiiittt_2621.mp4",
        trailer_embed: "",
        languages: {
            "Bengali": { 
                mp4: "https://archive.org/download/mt-15-share-yamaha-mt-15-lovers-mention-your-story-mt-15-lovers-rohiiittt-2621/%F0%9F%A5%80MT15%20%F0%9F%98%8D%20share%20yamaha%20MT15%20lovers%20mention%20your%20story%20MT15%20lovers%20%F0%9F%92%95%E2%9D%A4%EF%B8%8F%E2%80%8E%40rohiiittt_2621.mp4", 
                embed: "" 
            }
        }
    },
    {
        id: 3,
        title: "Ashley's Hug Time",
        category: "Drama",
        year: "2013",
        rating: "7.5",
        maturity: "16+",
        desc: "A classic narrative piece from the BlipTV archives.",
        poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
        trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
        trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
        trailer_embed: "",
        languages: {
            "English": { 
                mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4", 
                embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343." 
            }
        }
    },
    {
    id: 4,
    title: "Ashley's Hug Time",
    category: "Drama",
    year: "2013",
    rating: "7.5",
    maturity: "16+",
    desc: "A classic narrative piece from the BlipTV archives.",
    poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
    trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
    trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
    trailer_embed: "",
    languages: {
        "English": {
            mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
            embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
        }
    }
},
 {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
  {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
  {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
  {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
  {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
  {
     id: 4,
     title: "Ashley's Hug Time",
     category: "Drama",
     year: "2013",
     rating: "7.5",
     maturity: "16+",
     desc: "A classic narrative piece from the BlipTV archives.",
     poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
     trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
     trailer_embed: "",
     languages: {
         "English": {
             mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
             embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
         }
     }
 },
{
    id: 5,
    title: "Ashley's Hug Time",
    category: "Drama",
    year: "2013",
    rating: "7.5",
    maturity: "16+",
    desc: "A classic narrative piece from the BlipTV archives.",
    poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
    trailer_poster: "https://i.postimg.cc/c1Rj1xbK/IMG_3336.png",
    trailer_mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
    trailer_embed: "",
    languages: {
        "English": {
            mp4: "https://archive.org/download/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343./bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343.mp4",
            embed: "https://archive.org/embed/bliptv-20131013-191530-AshleysHugtime-AshleyIsASexMachine343."
        }
    }
}
];
