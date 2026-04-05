const WhatsAppOptions = ({ type, data }) => {
  const { party_name, tripta_total_due, tripta31To45Amount, above45Formatted } =
    data;

  if (type === 'NO_DUE') {
    return (
      <>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 1</span>
          <p>Hi,</p>
          <p>
            The bags have been dispatched to you. Request you to clear the
            outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 2</span>
          <p>Hello,</p>
          <p>
            We have urgent requirement of funds and will be highly obliged if
            you could clear the outstanding amount of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 3</span>
          <p>Greetings,</p>
          <p>
            Request you to look into our outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 4</span>
          <p>Hi,</p>
          <p>
            I understand that you must have been occupied due to the festive
            sale season. We have supported{' '}
            <span className="fw-bold">{party_name}</span> in terms of giving
            extended credit periods. We are now in grave need of funds. Request
            you to kindly clear the pending dues of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 5</span>
          <p>Hi,</p>
          <p>
            The bags have been supplied at a very nominal rate. It is
            sustainable for us only if we get fast payment. Kindly clear the
            pending amount of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>Very humbly asking you - how are we supposed to work?</p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 6</span>
          <p>Hi,</p>
          <p>
            We have put in 110% effort to deliver the top notch quality bags on
            time. Kindly clear the pending amount of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
      </>
    );
  } else if (type === 'ABOVE_45') {
    return (
      <>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 1</span>
          <p>
            {`Our association with ${party_name ?? ''} is very
            long. We are grateful that you have trusted us for your
            branded bags. Through mutual support, we have together
            progresses and we are highly grateful for this.`}
          </p>
          <p>
            {`I understand that you must have been occupied due to the
            festive sale season. We have supported ${party_name ?? ''} in
            terms of giving extended credit periods. We are now in
            grave need of funds.`}
          </p>
          <p>
            <span className="fw-bold">
              {`Rs. ₹${above45Formatted}`} is due since more than 45 days.{' '}
            </span>
            Request you to kindly clear outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            In this competitive business world, very humbly asking you - how are
            we supposed to work?
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 2</span>
          <p>
            I understand that you have lot many outlets to handle and as a
            result there is always a cash crunch due to a large working capital
            involved.
          </p>
          <p>
            {`Since quite some time we are going in circles with ${
              party_name ?? ''
            } orders
                            wherein, we are delivering the goods at regular intervals,
                            but the payments are not being released to us.`}
          </p>
          <p>
            {`We appreciate the continuous business from ${
              party_name ?? ''
            }, but
                            there is a huge gap between time of supply and time of
                            payment.`}
          </p>
          <p>
            <span className="fw-bold">
              {`Rs. ₹${above45Formatted}`} is due since more than 45 days.{' '}
            </span>
            Request you to kindly clear outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            In this competitive business world, very humbly asking you - how are
            we supposed to work?
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 3</span>
          <p>
            Kindly look into immediate payment of{' '}
            <span className="fw-bold">
              {`Rs. ₹${above45Formatted}`} which is due since more than 45 days.{' '}
            </span>{' '}
            Request you to kindly clear the total outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            We have huge pending payables to our suppliers, and things are
            becoming very difficult.
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 4</span>
          <p>Hello,</p>
          <p>
            We have urgent requirement of funds and will be highly obliged if
            you could clear the outstanding amount of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 5</span>
          <p>Greetings,</p>
          <p>
            Request you to look into our outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
      </>
    );
  } else if (type === 'ABOVE_30') {
    return (
      <>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 1</span>
          <p>
            {`I understand that you must have been occupied due to the
            festive sale season. We have supported ${party_name ?? ''} in
            terms of giving extended credit period. We are in urgent
            need of funds.`}
          </p>
          <p>
            Request you to kindly clear outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            Business is highly competitive now - how are we supposed to work?
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 2</span>
          <p>
            {`I understand that you have lot many outlets to handle and
            as a result there is always a cash crunch due to a large
            working capital involved.We appreciate the continuous
            business from ${party_name ?? ''}.`}
          </p>
          <p>
            <span className="fw-bold">
              {`Rs. ${tripta31To45Amount}`} is due since more than 30 days.
            </span>
            Request you to kindly clear outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            Business is highly competitive now - how are we supposed to work?
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 3</span>
          <p>
            Kindly look into immediate payment of{' '}
            <span className="fw-bold">
              {`Rs. ₹${above45Formatted}`} which is due since more than 30 days.
            </span>{' '}
            Request you to kindly clear the total outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
          <p>
            We have huge pending payables to our suppliers, and things are
            becoming very difficult.
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 4</span>
          <p>Hello,</p>
          <p>
            We have urgent requirement of funds and will be highly obliged if
            you could clear the outstanding amount of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
        <div className="list_item">
          <span className="fw-bold option_title">OPTION: 5</span>
          <p>Greetings,</p>
          <p>
            Request you to look into our outstanding payment of{' '}
            <span className="fw-bold">{`Rs. ${tripta_total_due}`}</span>
          </p>
        </div>
      </>
    );
  }

  return <p>No Content Available</p>;
};

export default WhatsAppOptions;
