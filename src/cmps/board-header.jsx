import React, { useState } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { boardService } from "../services/board.service.local";
import { IoFilterSharp } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { MemberModal } from "./member-Modal";
import { FilterModal } from "./filter-modal";
import { useSelector } from "react-redux";
import { setFilter } from "../store/system.actions";
import { SideMenu } from "./side-menu";

export function BoardHeader({ board }) {
  const [currMember, setCurrMember] = useState(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false)
  const filter = useSelector((storeState) => storeState.systemModule.filter)

  function onToggleStar() {
    boardService.toggleStar(board._id)
  }

  function onMemberSelect(member = null) {
    setCurrMember(member)
  }

  function onToggleFilterModal() {
    setIsFilterModalOpen(prevState => !prevState)
  }

  return (
    <div className="board-header">
      <div className="board-status">
        <span className="board-title">{board.title}</span>
        <span onClick={onToggleStar} className={`btn-star ${board.isStarred ? 'starred' : ''}`}>{board.isStarred ? <AiFillStar /> : <AiOutlineStar />}</span>
      </div>
      <div className={`board-action ${isSideMenuOpen ? 'menu-open' : ''}`}>
        <button onClick={onToggleFilterModal} className={`btn-filter ${filter.keyword ? 'active' : ''}`} ><IoFilterSharp /> Filter</button>
        {filter.keyword && <button className="btn-clear-filter" onClick={() => setFilter({ keyword: '' })} title="Clear filter">X</button>}
        <div className="members-container">
          {board.members?.map((member, idx) => {
            return (
              <img onClick={() => setCurrMember(member)} style={{ left: `${idx * 25}px` }} key={member._id} src={member.imgUrl} alt="" />
            )
          })}

        </div>
        {!isSideMenuOpen && <button className="btn-menu" onClick={() => setIsSideMenuOpen(true)}><HiDotsHorizontal /></button>}

        <SideMenu board={board} isSideMenuOpen={isSideMenuOpen} setIsSideMenuOpen={setIsSideMenuOpen} />
        {currMember && <MemberModal member={currMember} onMemberSelect={onMemberSelect} />}
        {isFilterModalOpen && <FilterModal board={board} onToggleFilterModal={onToggleFilterModal} />}
      </div>
    </div>
  )
}
