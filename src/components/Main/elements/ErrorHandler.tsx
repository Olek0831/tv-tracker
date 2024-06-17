import React from 'react';

function ErrorHandler(props: {errorCode: number}){

  let errorMessage: string;

  if (props.errorCode >= 500){
    if (props.errorCode === 502){
      errorMessage = "502 - Bad Gateway";
    }else if(props.errorCode === 503){
      errorMessage = "503 - Service Unavailable";
    }else if(props.errorCode === 504){
      errorMessage = "504 - Gateway Timeout";
    }else{
      errorMessage = props.errorCode+" - Server Error";
    }
  }else if(props.errorCode === 404){
    errorMessage = "404 - Resource Not Found";
  }else{
    errorMessage = props.errorCode+" - An Error Occured";
  }

  return <div className="error-cnt">{errorMessage}</div>
}

export default ErrorHandler;