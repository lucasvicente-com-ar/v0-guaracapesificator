"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, RefreshCw, Building2 } from "lucide-react"

export default function GuaracaPesificator() {
  const [pygPerUsd, setPygPerUsd] = useState("")
  const [arsPerUsd, setArsPerUsd] = useState("")
  const [pygAmount, setPygAmount] = useState("")
  const [arsAmount, setArsAmount] = useState("")
  const [usdAmount, setUsdAmount] = useState("")
  const [loadingARS, setLoadingARS] = useState(false)
  const [loadingPYG, setLoadingPYG] = useState(false)
  const [lastEditedField, setLastEditedField] = useState("pyg")
  const [buildNumber, setBuildNumber] = useState(32)

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildNumber((prev) => prev + 1)
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // Get detailed browser and device information
  const getBrowserInfo = () => {
    const ua = navigator.userAgent
    let browserName = "Unknown"
    let browserVersion = "Unknown"
    let osName = "Unknown"
    let deviceType = "Desktop"

    // Detect browser
    if (ua.includes("Chrome") && !ua.includes("Edg")) {
      browserName = "Chrome"
      browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Firefox")) {
      browserName = "Firefox"
      browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Safari") && !ua.includes("Chrome")) {
      browserName = "Safari"
      browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Edg")) {
      browserName = "Edge"
      browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown"
    } else if (ua.includes("Opera") || ua.includes("OPR")) {
      browserName = "Opera"
      browserVersion = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || "Unknown"
    }

    // Detect OS
    if (ua.includes("Windows")) {
      osName = "Windows"
      if (ua.includes("Windows NT 10.0")) osName = "Windows 10/11"
      else if (ua.includes("Windows NT 6.3")) osName = "Windows 8.1"
      else if (ua.includes("Windows NT 6.2")) osName = "Windows 8"
      else if (ua.includes("Windows NT 6.1")) osName = "Windows 7"
    } else if (ua.includes("Mac OS X")) {
      osName = "macOS"
      const version = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, ".")
      if (version) osName = `macOS ${version}`
    } else if (ua.includes("Linux")) {
      osName = "Linux"
    } else if (ua.includes("Android")) {
      osName = "Android"
      deviceType = "Mobile"
      const version = ua.match(/Android ([0-9.]+)/)?.[1]
      if (version) osName = `Android ${version}`
    } else if (ua.includes("iPhone") || ua.includes("iPad")) {
      osName = ua.includes("iPad") ? "iPadOS" : "iOS"
      deviceType = ua.includes("iPad") ? "Tablet" : "Mobile"
      const version = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, ".")
      if (version) osName = `${osName} ${version}`
    }

    // Detect device type more accurately
    if (ua.includes("Mobile") && !ua.includes("iPad")) {
      deviceType = "Mobile"
    } else if (ua.includes("Tablet") || ua.includes("iPad")) {
      deviceType = "Tablet"
    }

    return {
      browserName,
      browserVersion,
      osName,
      deviceType,
      userAgent: ua,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      screenColorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      touchSupport: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      webGL: !!window.WebGLRenderingContext,
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
    }
  }

  // Get performance metrics
  const getPerformanceMetrics = () => {
    if (!window.performance) return null

    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType("paint")

    return {
      loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.fetchStart) : null,
      domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart) : null,
      firstPaint: paint.find((p) => p.name === "first-paint")?.startTime || null,
      firstContentfulPaint: paint.find((p) => p.name === "first-contentful-paint")?.startTime || null,
      connectionType: (navigator as any).connection?.effectiveType || "unknown",
      connectionDownlink: (navigator as any).connection?.downlink || null,
      connectionRtt: (navigator as any).connection?.rtt || null,
    }
  }

  // Log user visit with detailed information
  useEffect(() => {
    const logVisit = async () => {
      try {
        const browserInfo = getBrowserInfo()
        const performanceMetrics = getPerformanceMetrics()

        await fetch("/api/log-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || "direct",
            browserInfo,
            performanceMetrics,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            sessionId:
              sessionStorage.getItem("sessionId") ||
              (() => {
                const id = Math.random().toString(36).substring(2, 15)
                sessionStorage.setItem("sessionId", id)
                return id
              })(),
          }),
        })
      } catch (error) {
        console.error("Error logging visit:", error)
      }
    }

    // Wait a bit for performance metrics to be available
    setTimeout(logVisit, 1000)
  }, [])

  // Log conversion events
  const logConversion = async (fromCurrency: string, toCurrency: string, amount: number) => {
    try {
      await fetch("/api/log-conversion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          fromCurrency,
          toCurrency,
          amount,
          sessionId: sessionStorage.getItem("sessionId"),
        }),
      })
    } catch (error) {
      console.error("Error logging conversion:", error)
    }
  }

  const formatPYG = (num: number) => {
    return Math.round(num).toLocaleString("de-DE")
  }

  const formatARS = (num: number) => {
    return num.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatUSD = (num: number) => {
    return num.toLocaleString("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const parseFormattedNumber = (str: string) => {
    return Number.parseFloat(
      str.replace(/[.,]/g, (match, offset, string) => {
        const lastIndex = string.lastIndexOf(match)
        if (offset === lastIndex && string.length - offset <= 3) {
          return "."
        }
        return ""
      }),
    )
  }

  const fetchDolarBlue = async () => {
    setLoadingARS(true)
    try {
      const response = await fetch("https://dolarapi.com/v1/dolares/blue")
      const data = await response.json()
      if (data && data.venta) {
        setArsPerUsd(data.venta.toString())
      }
    } catch (error) {
      console.error("Error fetching dolar blue:", error)
    } finally {
      setLoadingARS(false)
    }
  }

  const fetchUSDPYG = async () => {
    setLoadingPYG(true)
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD")
      const data = await response.json()
      if (data && data.rates && data.rates.PYG) {
        setPygPerUsd(Math.round(data.rates.PYG).toString())
      }
    } catch (error) {
      console.error("Error fetching USD/PYG:", error)
    } finally {
      setLoadingPYG(false)
    }
  }

  useEffect(() => {
    fetchDolarBlue()
    fetchUSDPYG()
  }, [])

  useEffect(() => {
    const pygRate = Number.parseFloat(pygPerUsd)
    const arsRate = Number.parseFloat(arsPerUsd)

    if (isNaN(pygRate) || isNaN(arsRate) || pygRate <= 0 || arsRate <= 0) {
      return
    }

    if (lastEditedField === "pyg" && pygAmount) {
      const montoPYG = parseFormattedNumber(pygAmount)
      if (!isNaN(montoPYG) && montoPYG > 0) {
        const resultadoARS = montoPYG * (arsRate / pygRate)
        setArsAmount(formatARS(resultadoARS))
        const resultadoUSD = montoPYG / pygRate
        setUsdAmount(formatUSD(resultadoUSD))
        logConversion("PYG", "ARS", montoPYG)
      }
    } else if (lastEditedField === "ars" && arsAmount) {
      const montoARS = parseFormattedNumber(arsAmount)
      if (!isNaN(montoARS) && montoARS > 0) {
        const resultadoPYG = montoARS * (pygRate / arsRate)
        setPygAmount(formatPYG(resultadoPYG))
        const resultadoUSD = montoARS / arsRate
        setUsdAmount(formatUSD(resultadoUSD))
        logConversion("ARS", "PYG", montoARS)
      }
    } else if (lastEditedField === "usd" && usdAmount) {
      const montoUSD = parseFormattedNumber(usdAmount)
      if (!isNaN(montoUSD) && montoUSD > 0) {
        const resultadoPYG = montoUSD * pygRate
        setPygAmount(formatPYG(resultadoPYG))
        const resultadoARS = montoUSD * arsRate
        setArsAmount(formatARS(resultadoARS))
        logConversion("USD", "PYG", montoUSD)
      }
    }
  }, [pygPerUsd, arsPerUsd, pygAmount, arsAmount, usdAmount, lastEditedField])

  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [46, 8, 9, 27, 13, 110, 190, 188].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return
    }
    if ((e.shiftKey || e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault()
    }
  }

  const handlePygChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, "")
    setPygAmount(cleanValue)
    setLastEditedField("pyg")
    if (!cleanValue) {
      setArsAmount("")
      setUsdAmount("")
    }
  }

  const handleArsChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, "")
    setArsAmount(cleanValue)
    setLastEditedField("ars")
    if (!cleanValue) {
      setPygAmount("")
      setUsdAmount("")
    }
  }

  const handleUsdChange = (value: string) => {
    const cleanValue = value.replace(/[^\d.,]/g, "")
    setUsdAmount(cleanValue)
    setLastEditedField("usd")
    if (!cleanValue) {
      setPygAmount("")
      setArsAmount("")
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-slate-700 border-0 rounded-2xl">
        <CardHeader className="text-center space-y-4 bg-slate-600 text-white rounded-t-2xl p-6">
          <div className="flex items-center justify-center gap-3">
            <CardTitle className="font-bold text-2xl">Guaraca Pesificator</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="pyg-rate" className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-400" />
                Guaraníes por $1 USD:
              </Label>
              <Button
                onClick={fetchUSDPYG}
                disabled={loadingPYG}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white border-0"
              >
                <RefreshCw className={`h-4 w-4 ${loadingPYG ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <Input
              id="pyg-rate"
              type="number"
              inputMode="decimal"
              value={pygPerUsd}
              onChange={(e) => setPygPerUsd(e.target.value)}
              onKeyDown={handleNumericInput}
              className="bg-slate-600 border-0 text-white h-16 focus:bg-slate-500 rounded-sm text-3xl text-center"
              placeholder="Actualizando..."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="ars-rate" className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-400" />
                Pesos por $1 USD (Blue):
              </Label>
              <Button
                onClick={fetchDolarBlue}
                disabled={loadingARS}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white border-0"
              >
                <RefreshCw className={`h-4 w-4 ${loadingARS ? "animate-spin" : ""}`} />
              </Button>
            </div>
            <Input
              id="ars-rate"
              type="number"
              inputMode="decimal"
              value={arsPerUsd}
              onChange={(e) => setArsPerUsd(e.target.value)}
              onKeyDown={handleNumericInput}
              className="text-3xl bg-slate-600 border-0 text-white h-16 focus:bg-slate-500 rounded-sm text-center"
              placeholder="Actualizando..."
            />
          </div>

          <div className="text-center">
            <p className="text-slate-300 text-lg font-medium mb-4">Convertidor de monedas:</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label htmlFor="pyg-amount" className="text-lg font-medium text-slate-200 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-purple-400" />
                Guaraníes (PYG):
              </Label>
              <Input
                id="pyg-amount"
                type="text"
                inputMode="numeric"
                value={pygAmount}
                onChange={(e) => handlePygChange(e.target.value)}
                onKeyDown={handleNumericInput}
                placeholder="0"
                className="bg-slate-600 border-0 text-white h-16 focus:bg-slate-500 rounded-sm text-center text-3xl"
              />
            </div>

            <div className="bg-green-500 text-white py-4 px-6 rounded-md">
              <Label htmlFor="ars-amount" className="text-white text-sm font-medium mb-2 block">
                Pesos Argentinos (ARS):
              </Label>
              <Input
                id="ars-amount"
                type="text"
                inputMode="decimal"
                value={arsAmount}
                onChange={(e) => handleArsChange(e.target.value)}
                onKeyDown={handleNumericInput}
                placeholder="0,00"
                className="bg-green-600 border-0 text-white h-12 focus:bg-green-700 rounded text-center text-2xl font-bold placeholder:text-green-200"
              />
            </div>

            <div className="bg-blue-500 text-white py-4 px-6 rounded-md">
              <Label htmlFor="usd-amount" className="text-white text-sm font-medium mb-2 block">
                Dólares Estadounidenses (USD):
              </Label>
              <Input
                id="usd-amount"
                type="text"
                inputMode="decimal"
                value={usdAmount}
                onChange={(e) => handleUsdChange(e.target.value)}
                onKeyDown={handleNumericInput}
                placeholder="0,00"
                className="bg-blue-600 border-0 text-white h-12 focus:bg-blue-700 rounded text-center text-2xl font-bold placeholder:text-blue-200"
              />
            </div>
          </div>

          <div className="text-center pt-6 border-t border-slate-600">
            <div className="flex justify-between items-center">
              <p className="text-slate-400 text-sm">by: LV made with iA and Brain</p>
              <p className="text-slate-500 text-xs">v1.0.{buildNumber}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
