import React from "react";

function Pagination(props: {page: number, addButtons: number, onClick: (i: number)=>void, onPrev: ()=>void, onNext: ()=>void}){

  const currentPage: number = (props.page+1);
  let buttons: number;
  let addedButtons: number;

  if (props.addButtons<0){
     addedButtons = 0;
  }else{
     addedButtons = props.addButtons;
  }

  if(currentPage<=5){
    buttons = currentPage + addedButtons;
  }else{
    buttons = addedButtons + 5;
  }

  function renderButton(i: number){
    if (i===currentPage){
      return <button key={i} className="pagination-button active">{i}</button>;
    }else{
      return <button key={i} className="pagination-button" onClick={() => props.onClick(i-1)}>{i}</button>;
    }
  }

  return(
    <div className="pagination-cnt">
      <div className="pagination-prev-cnt">
        <button className="pagination-prev-btn" onClick={() => props.onPrev()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-left" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 15l-6 -6l-6 6h12" transform="rotate(270 12 12)" />
          </svg>
        </button>
      </div>
      <div className="pagination-btns-cnt">
      {Array(buttons).fill(null).map((_item: null, i) => {
        if (currentPage<=5){
          return renderButton(i+1);
        }else{
          return renderButton((currentPage-4)+i);
        }
      })}
      </div>
      <div className="pagination-next-cnt">
        <button className="pagination-next-btn" onClick={() => props.onNext()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-caret-right" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M18 15l-6 -6l-6 6h12" transform="rotate(90 12 12)" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Pagination;