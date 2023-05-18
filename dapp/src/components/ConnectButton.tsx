import { useConnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'

export const ConnectButton = () => {
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    return <>
        <button color="transparent" onClick={() => connect()} className="btn sm:h-9 text-white font-semibold">
            <h3>Connect</h3>
        </button>
    </>
}