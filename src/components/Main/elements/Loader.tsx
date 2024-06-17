import React from 'react';
import Pagination from './Pagination';

function Loader(props: LoaderProps){

  if (props.loading === true){
    return (
      <div className="loader">
        <div className="loading-animation"></div>
        <div className="loading-text">Loading...</div>
      </div>
    )
  }else if(props.showsToShow.length === 0){
    return (
      <div className="no-matches">It looks like we didn't find what you're looking for.</div>
    )
  }else{
    let imgSrc: string;
    return (
      <>
        <div className="shows-main">
          {props.showsToShow && props.showsToShow.length>0 && props.showsToShow.map((item: Show) => {

            if(item.image?.medium){
              imgSrc = item.image?.medium;
            }else{
              imgSrc = "./src/assets/img/Placeholder.png";
            }

            return (
              <div key={item.id} className="show-cnt">
                <img className="show-img" src={imgSrc} onClick={() => props.details(item.id)} alt="Show Image"/>
                <div className="showlist-show-info-cnt">
                  <button className="showlist-show-title-btn" onClick={() => props.details(item.id)}>{item.name}</button>
                </div>
              </div>
            );
          })}
        </div>
        <Pagination page={props.showsPage} addButtons={props.buttons} onClick={(i) => props.handlePagination(i)} onPrev={() => props.onPrev()} onNext={() => props.onNext()}/>
      </>
    )
  }
}

export default Loader;