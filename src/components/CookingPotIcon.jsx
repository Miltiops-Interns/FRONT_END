import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define animations
const sube3 = keyframes`
  0%, 10% { transform: translateY(0px); }
  20%, 25% { transform: translateY(1px); }
  30%, 35% { transform: translateY(0px); }
  40%, 45% { transform: translateY(1px); }
  50%, 55% { transform: translateY(-35px) rotate(-12deg); }
  60%, 65% { transform: translateY(-35px) rotate(-7deg); }
  70%, 75% { transform: translateY(-35px) rotate(-12deg); }
  80%, 85% { transform: translateY(-35px) rotate(-7deg); }
  90%, 95% { transform: translateY(-35px) rotate(-12deg); }
  100% { transform: translateY(-1px); }
`;
const r = keyframes`
  0%,10%,20%,25%,30%,35%,40%,45%{opacity:0}
  50%,55%{opacity:.5;transform:scale(.5) translateY(0px)}
  60%,65%{opacity:1;transform:scale(1) translateY(0px)}
  70%,75%{opacity:1;transform:scale(.8) translateY(30px)}
  80%,85%{opacity:1;transform:scale(1) translateY(30px)}
  90%,95%{opacity:1;transform:scale(1) translateY(30px)}
  100%{transform:translateY(21px)}
`;
const r3 = keyframes`
  0%,10%,20%,25%,30%,35%,40%,45%,50%,55%{opacity:0}
  50%,55%{opacity:.5;transform:scale(.3) translateY(0px)}
  60%,65%{opacity:1;transform:scale(1) translateY(0px)}
  70%,75%{opacity:1;transform:scale(.8) translateY(0px)}
  80%,85%{opacity:1;transform:scale(1) translateY(30px)}
  90%,95%{opacity:1;transform:scale(1) translateY(30px)}
  100%{transform:translateY(21px)}
`;
const r7 = keyframes`
  0%,10%,20%,25%,30%,35%,40%,45%,50%,55%{opacity:0}
  50%,55%{opacity:.5;transform:scale(.3) translateY(0px)}
  60%,65%{opacity:1;transform:scale(1) translateY(0px)}
  70%,75%{opacity:1;transform:scale(.8) translateY(0px)}
  80%,85%{opacity:1;transform:scale(1) translateY(0px)}
  90%,95%{opacity:1;transform:scale(1) translateY(30px)}
  100%{transform:translateY(21px)}
`;
const bur = keyframes`
  0%, 25% {opacity:1;transform:translateY(-3px)}
  40%,50%{opacity:.7;transform:translateY(0px)}
  70%,80%{opacity:1;transform:translateY(-3px)}
  90%,100%{opacity:.7;transform:translateY(0px)}
`;
const bur3 = keyframes`
  0%, 25% {opacity:.7;transform:translateY(0px)}
  40%,50%{opacity:1;transform:translateY(-3px)}
  70%,80%{opacity:.7;transform:translateY(0px)}
  90%,100%{opacity:1;transform:translateY(-3px)}
`;
const fuego = keyframes`
  0%{transform:rotate(-132deg) scale(.8)}
  100%{transform:rotate(-132deg) scale(1)}
`;
const fuego3 = keyframes`
  0%{transform:rotate(-132deg) scale(1)}
  100%{transform:rotate(-132deg) scale(.8)}
`;


// Component Styles
const IconWrapper = styled.div`
  width: 192px;
  height: 192px;
  border-radius: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;

  .olla {
    width: 80px;
    height: 65px;
    border-radius: 0 0 30px 30px;
    border: 3px solid #303744;
    background: #d7a453;  
    margin-top: 30px;
    z-index: 333;
  }
  .olla::before {
    content: "";
    position: absolute;
    width: 65px;
    height: 65px;
    border-radius: 0 0 30px 30px;
    background: #d7a453;
    margin: 0 14px;
  }
  .olla::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-image: linear-gradient(to bottom, rgba(235,241,246,1) 0%,rgba(213,235,251,0.5) 100%);
    margin: 0px 63px;
  }
  .curva {
    position: absolute;
    width: 50px;
    height: 40px;
    border-radius: 0 0 30px 30px;
    background-image: linear-gradient(to bottom, rgba(235,241,246,1) 0%,rgba(224,238,249,0.3) 50%,rgba(213,235,251,0.3) 100%);  
    margin: 25px 25px;
    z-index: 999;
  }
  .curva::before {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 0 0 30px 30px;
    background: #d7a453;
    margin: 0 -2px;
  }
  .lado, .lado3 {
    position: absolute;
    width: 9px;
    height: 5px;
    background: #d7a453;
    border-top: 2px solid #303744;
    border-bottom: 2px solid #303744;
  }
  .lado { margin: 3px -9px; }
  .lado3 { margin: 3px 80px; }
  .lado::before, .lado3::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 11px;
    border-radius: 100%;
    background: #d7a453;
  }
  .lado::before {
    border-top: 2px solid #303744;
    border-bottom: 2px solid #303744;
    border-left: 2px solid #303744;
    margin: -2px -9px;
  }
  .lado3::before {
    border-top: 2px solid #303744;
    border-bottom: 2px solid #303744;
    border-right: 2px solid #303744;
    margin: -2px 3px;
  }
  .tape {
    position: absolute;
    width: 80px;
    height: 12px;
    border-radius: 30px 30px 0 0;
    background: #d7a453;  
    border: 3px solid #394251;
    margin: -21px -3px;
    animation: ${sube3} 2.1s linear infinite;
  }
  .tape::before {
    content: "";
    position: absolute;
    width: 53px;
    height: 10px;
    border-radius: 0 30px 0 0;
    background: #d7a453;
    border-right: 12px solid rgba(235,241,246,.7);
    margin: 0 10px;
  }
  .tape::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 100%;
    background: #303744;
    margin: -12px 33px;
  }
  .red {
    position: absolute;
    width: 19px;
    height: 19px;
    border-radius: 100%;
    background: #c12b26;
    margin: -50px 53px;
    animation: ${r} 2.1s linear infinite;
  }
  .gray {
    position: absolute;
    width: 19px;
    height: 17px;
    border-radius: 100%;
    background: #c6c9b9;
    border: 2px solid #808375;
    margin: -55px 30px;
    animation: ${r3} 2.1s linear infinite;
  }
  .green {
    position: absolute;
    width: 19px;
    height: 17px;
    border-radius: 100%;
    background: #049e9a;
    margin: -45px 12px;
    animation: ${r7} 2.1s linear infinite;
  }
  .b1, .b2, .b3, .b4, .b5, .b6 {
    position: absolute;
    width: 21px;
    height: 21px;
    border-radius: 100%;
    background: white;
  }
  .b1 { margin: -30px 3px; }
  .b2 { margin: -27px 21px; }
  .b3 { margin: -30px 35px; }
  .b4 { margin: -27px 45px; }
  .b5 { margin: -30px 55px; }
  .b6 { margin: -27px 65px; }
  .b1, .b3, .b5 { animation: ${bur} 1.2s alternate infinite; }
  .b2, .b4, .b6 { animation: ${bur3} 1.2s alternate infinite; }
  .fire {
    position: absolute;
    width: 50px;
    height: 7px;
    background: #303744;
    border-radius: 3px;
    margin: 75px 17px;
  }
  .l1, .l2, .l3, .l4, .l5, .l6 {
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    background: #ea9627;
    border: 3px solid #dd6b33;
    border-radius: 50px 50px 0 50px;
    transform: rotate(-132deg);
  }
  .l1 { margin: -7px 0; }
  .l2 { margin: -7px 9px; }
  .l3 { margin: -7px 17px; }
  .l4 { margin: -7px 25px; }
  .l5 { margin: -7px 33px; }
  .l6 { margin: -7px 40px; }
  .l1, .l3, .l5 { animation: ${fuego} .9s alternate infinite; }
  .l2, .l4, .l6 { animation: ${fuego3} .9s alternate infinite; }
`;

const CookingPotIcon = () => {
  return (
    <IconWrapper>
      <div className="verduras">
        <div className="red"></div>
        <div className="gray"></div>
        <div className="green"></div>
        <div className="burbujas">
          <div className="b1"></div>
          <div className="b2"></div>
          <div className="b3"></div>
          <div className="b4"></div>
          <div className="b5"></div>
          <div className="b6"></div>
        </div>
      </div>
      <div className="olla">
        <div className="lado"></div>
        <div className="lado3"></div>
        <div className="curva"></div>
        <div className="tape"></div>
        <div className="fire">
          <span className="l1"></span><span className="l2"></span>
          <span className="l3"></span><span className="l4"></span>
          <span className="l5"></span><span className="l6"></span>
        </div>
      </div>
    </IconWrapper>
  );
};

export default CookingPotIcon;