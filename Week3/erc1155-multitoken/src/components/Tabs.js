import React, { useState } from 'react';
import Mint from "./Mint"
import Forge from "./Forge"
import Balances from "./Balances"
import Trade from "./Trade"

const Tabs = ({ token0, token1, token2, token3, token4, token5, token6 }) => {
    const [currentTab, setCurrentTab] = useState('1');

    const tabs = [
        {
            id: 1,
            tabTitle: 'Your total balance',
            content: <Balances balanceToken0={token0} balanceToken1={token1} balanceToken2={token2} balanceToken3={token3} balanceToken4={token4} balanceToken5={token5} balanceToken6={token6} />
        },
        {
            id: 2,
            tabTitle: 'Mint Tokens 0,1 & 2',
            title: 'Title 2',
            content: <Mint />
        },
        {
            id: 3,
            tabTitle: 'Forging Tokens 3,4,5 & 6',
            title: 'Title 3',
            content: <Forge />
        },
        {
            id: 4,
            tabTitle: 'Trade tokens 0, 1 & 2',
            title: 'Title 4',
            content: <Trade />
        }
    ];

    const handleTabClick = (e) => {
        setCurrentTab(e.target.id);
    }

    return (
        <div className='container'>
            <div className='tabs'>
                {tabs.map((tab, i) =>
                    <button key={i} id={tab.id} disabled={currentTab === `${tab.id}`} onClick={(handleTabClick)}>{tab.tabTitle}</button>
                )}
            </div>
            <div className='content'>
                {tabs.map((tab, i) =>
                    <div key={i}>
                        {currentTab === `${tab.id}` && <div>    <div>{tab.content}</div></div>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Tabs;