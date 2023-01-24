import { useEffect } from "react";
import { useState } from "react";
import { boardService } from "../services/board.service.local";
import { utilService } from "../services/util.service";
import { BiSearch } from "react-icons/bi"
import { updateBoard } from "../store/board.actions";


export function BoardImgPicker({ board, isBgImgPickerMenuOpen }) {

    const [imgs, setImgs] = useState(null)
    const [searchTxt, setSearchTxt] = useState('')

    useEffect(() => {
        setImgs(utilService.getbgImgs())
    }, [])

    async function getImgsFromApi(searchTxt) {
        try {
            const result = await boardService.getUnsplashApi().search
                .getPhotos({ query: searchTxt, orientation: "landscape", per_page: '10' })
            return result.response.results.map(item => {
                return {
                    id: item.id,
                    user: item.user.username,
                    url: item.urls.regular
                }
            })
        } catch (error) {
            console.log("something went wrong!")
        }
    }

    async function onSubmit(ev) {
        ev.preventDefault()
        if (!searchTxt) {
            setImgs(utilService.getbgImgs())
        } else {
            const imgsToSet = await getImgsFromApi(searchTxt)
            setImgs(imgsToSet)
        }
    }

    function onSetStyle(imgUrl) {
        let boardToSet = JSON.parse(JSON.stringify(board))
        boardToSet.style = {
            backgroundImage: `url('${imgUrl}')`,
            backgroundSize: 'cover',
        }
        updateBoard(boardToSet)
    }

    return (
        <section className={`board-img-picker ${isBgImgPickerMenuOpen ? 'open' : ''}`}>
            <form className="search-container" onSubmit={onSubmit}>
                <BiSearch />
                <input type="text"
                    placeholder="Photos"
                    value={searchTxt}
                    onChange={({ target }) => setSearchTxt(target.value)} />
            </form>

            {imgs && <div className="imgs-container">
                {imgs.slice(0, 10).map(img => {
                    return (
                        <div className="img-item" key={img.id} onClick={() => onSetStyle(img.url)}>
                            <img src={img.url} />
                            <a href={`https://unsplash.com/@${img.user}`} target="_blank">{img.user}</a>
                        </div>
                    )
                })}
            </div>}

            <p>By using images from Unsplash, you agree to their <a href={`https://unsplash.com/license`} target="_blank">license</a> and <a href={`https://unsplash.com/terms`} target="_blank">Terms of Service</a></p>

        </section>
    )
}