export default function TokenCard() {
  return (
    <a href="/buy" className="coin_box coin_box_big">
      <div className="d-flex mb-2">
        <div className="coin_box_left">
          <img src="/img/token1.jpg" alt="token" />
        </div>

        <div className="ps-1">
          <h3>Occy Token (OCCY)</h3>
          <div className="op_05">Despair</div>
          <div className="op_05">EvH6Jm · 4m ago</div>

          <div className="d-flex gap-2 align-items-center">
            MC $9.5K
            <div className="progress w100">
              <div className="progress-bar" style={{ width: "70%" }} />
            </div>
            <span className="text-success">▲ 2.5%</span>
          </div>
        </div>
      </div>
    </a>
  );
}
