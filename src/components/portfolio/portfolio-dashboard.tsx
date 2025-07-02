'use client'
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import { useWalletUi } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PortfolioData {
  balance: number
  tokens: TokenInfo[]
  totalValue: number
}

interface TokenInfo {
  mint: string
  amount: string
  decimals: number
  symbol?: string
}

export function PortfolioDashboard() {
  const { account, cluster } = useWalletUi()
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    balance: 0,
    tokens: [],
    totalValue: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const fetchPortfolioData = async () => {
    if (!account?.publicKey) return

    setIsLoading(true)
    try {
      const publicKey = new PublicKey(account.publicKey)
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

      const lamports = await connection.getBalance(publicKey)
      const solBalance = lamports / 1e9

      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      })

      const tokens = tokenAccounts.value.map((t) => {
        const info = t.account.data.parsed.info
        return {
          mint: info.mint,
          amount: info.tokenAmount.uiAmountString,
          decimals: info.tokenAmount.decimals,
          symbol: undefined,
        }
      })

      setPortfolio({
        balance: solBalance,
        tokens,
        totalValue: 0,
      })

      setError('')
    } catch (err: any) {
      console.error('Error fetching portfolio data:', err)
      setError(err.message || 'Failed to fetch portfolio data')
    }
    setIsLoading(false)
  }

  const requestAirdrop = async (publicKey: PublicKey) => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const signature = await connection.requestAirdrop(publicKey, 2 * 1e9) // 2 SOL
    await connection.confirmTransaction(signature, 'confirmed')
  }

  const calculateTotalValue = () => {
    const now = new Date()
    return portfolio.tokens.reduce((total, token) => {
      return total + parseFloat(token.amount)
    }, 0)
  }

  const formatBalance = (balance: number) => {
    return balance.toFixed(2)
  }

  if (!account) {
    return (
      <div className="p-2">
        <h1 className="text-3xl sm:text-5xl font-bold mb-6 text-primary text-center">
          Portfolio Dashboard - Please Connect Wallet
        </h1>
        <div className="bg-yellow-100 p-6 rounded-lg border-2 border-yellow-400 text-yellow-800 text-center">
          <p className="text-2xl font-bold whitespace-nowrap">
            ⚠️ WALLET CONNECTION REQUIRED - Please connect your Solana wallet to view your cryptocurrency portfolio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-primary text-center">
        My Portfolio Dashboard for Cryptocurrency Assets
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-xs">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-xl shadow border border-primary/30 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl whitespace-nowrap">SOL Balance Information</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-lg">Loading your balance...</div>
            ) : (
              <div>
                <p className="text-4xl font-bold text-primary whitespace-nowrap">
                  {formatBalance(portfolio.balance)} SOL
                </p>
                <p className="text-base text-gray-500 whitespace-nowrap">Current Network: {cluster.label}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow border border-primary/30 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl whitespace-nowrap">Token Holdings & Assets</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.tokens.length === 0 ? (
              <p className="text-lg">No tokens found in wallet</p>
            ) : (
              <div className="space-y-3">
                {portfolio.tokens.map((token, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <span className="text-lg font-medium text-primary">{token.symbol || 'Unknown Token'}</span>
                      <p className="text-sm text-gray-600 font-mono">{token.mint}</p>
                    </div>
                    <span className="text-lg font-mono whitespace-nowrap text-primary">{token.amount} tokens</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow border border-primary/30 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl whitespace-nowrap">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold whitespace-nowrap">${calculateTotalValue().toFixed(2)} USD</p>
            <Button
              onClick={fetchPortfolioData}
              disabled={isLoading}
              className="mt-6 w-full text-lg py-4 px-8 whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Refresh Portfolio Data
            </Button>
            {account && (
              <button
                onClick={() => requestAirdrop(new PublicKey(account.publicKey))}
                className="mt-2 bg-primary/20 text-primary font-bold px-4 py-2 rounded hover:bg-primary/30"
              >
                Request Airdrop
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
