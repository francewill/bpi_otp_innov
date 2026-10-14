'use strict';
/* ---------- bootstrap ----------
   Loaded last: every render* function from the screen-*.js files above
   already exists in the global scope, so this map can reference them
   directly. First paint happens here too. */
const RENDER={home:renderHome,hub:renderHub,pay:renderPay,learn:renderLearn,success:renderSuccess,redeem:renderRedeem,done:renderDone,scan:renderScan,supp:renderSupp,apply:renderApply,inst:renderInst,ploan:renderPloan,loan:renderLoan,fundApply:renderFundApply,fundDeposit:renderFundDeposit};
paint(true);
