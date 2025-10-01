import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define animations using the keyframes helper
const go = keyframes`
  0%, 25% {}
  30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85% {
    opacity: 1;
    transform: rotate(360deg);
  }
  100% { opacity: 0; }
`;

const go3 = keyframes`
  0%, 25% {}
  30%, 35%, 40%, 45%, 50%, 55%, 60%, 65%, 70%, 75%, 80%, 85% {
    opacity: 1;
    transform: rotate(360deg) scale(1.2);
  }
  100% {}
`;

// Create a styled component. All CSS is now inside this template literal.
const IconWrapper = styled.div`
  width: 192px;
  height: 192px;
  border-radius: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  .celu {
    width: 40px;
    height: 75px;
    background: #d7a453;
    border-radius: 12px;
    border-top: 9px solid #303744;
    border-bottom: 9px solid #303744;
    border-right: 5px solid #303744;
    border-left: 5px solid #303744;
  }

  .celu::before {
    content: "";
    position: absolute;
    border-top: 54px solid #c4d6b7;
    border-left: 12px solid transparent;
    border-right: 0px solid transparent;
    opacity: 0.5;
    height: 0;
    width: 0px;
    margin: 0 19px;



}

  }

  .c1, .c2, .c3, .c4, .c5 {
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: all 0.3s ease-in;
  }

  .c1, .c2, .c4, .c5 { animation: ${go} 2.1s linear infinite; }
  .c3 { animation: ${go3} 2.1s linear infinite; }
  .c1 { margin: 50px -53px; }
  .c2 { margin: 21px -40px; }
  .c3 { margin: 12px 5px; }
  .c4 { margin: 50px 65px; }
  .c5 { margin: 21px 50px; }

  .ice {
    width: 0;
    height: 0;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 12px solid #e9c488;
    transform: rotate(12deg);
    margin-top: -7px;
  }

  .ice::before, .ice::after {
    content: "";
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 100%;
  }

  .ice::before { background: #e6646b; margin: 7px -9px; }
  .ice::after { background: #694c39; margin: -19px -3px; }

  .pizza {
    width: 0;
    height: 0;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 19px solid #eabe9d;
    border-radius: 100px / 50px;
    transform: rotate(-12deg);
    margin-top: 5px;
  }

  .pizza::before, .pizza::after {
    content: "";
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background: #cb5043;
  }

  .pizza::before { margin: -14px -6px; }
  .pizza::after { margin: 9px 2px; }

  .cir {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 100%;
    background: #4bea8a;
    margin: 6px 2px;
  }

  .tarta {
    width: 17px;
    height: 17px;
    border-radius: 100%;
    background: #fdc34a;
    border: 3px solid #c6937d;
  }

  .tarta::before {
    content: "";
    display: block;
    width: 7px;
    height: 7px;
    border-radius: 100%;
    background: #b62b19;
    border: 5px solid #b5cc37;
    margin: 0px -2px;
    margin-top: -2px;
  }

  .fact {
    width: 9px;
    height: 9px;
    border-radius: 100%;
    background: #fadf99;
    border: 7px solid #c79958;
  }

  .salad {
    width: 21px;
    height: 12px;
    border-radius: 0px 0px 9px 9px;
    background: #dd8085;
    transform: rotate(-12deg);
  }

  .salad::before {
    content: "";
    display: block;
    width: 12px;
    height: 5px;
    border-radius: 12px 12px 0px 0px;
    background: #84c337;
    margin: -5px 4px;
  }
`;

const FoodOrderIcon = () => {
  return (
    <IconWrapper>
      <div className="celu">
        <div className="circles">
          <div className="c1"><div className="ice"></div></div>
          <div className="c2"><div className="pizza"></div><div className="cir"></div></div>
          <div className="c3"><div className="tarta"></div></div>
          <div className="c4"><div className="fact"></div></div>
          <div className="c5"><div className="salad"></div></div>
        </div>
      </div>
    </IconWrapper>
  );
};

export default FoodOrderIcon;