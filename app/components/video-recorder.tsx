"use client"

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Video, Square, Loader2 } from 'lucide-react'

export default function VideoRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        setVideoBlob(blob)
        if (videoRef.current) {
          videoRef.current.srcObject = null
          videoRef.current.src = URL.createObjectURL(blob)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks()
      tracks?.forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        className="w-full aspect-video bg-muted rounded-lg"
        autoPlay
        muted
        playsInline
      />
      <div className="flex justify-center">
        {isRecording ? (
          <Button
            variant="destructive"
            onClick={stopRecording}
            className="space-x-2"
          >
            <Square className="h-4 w-4" />
            <span>Stop Recording</span>
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={startRecording}
            className="space-x-2"
            disabled={!!videoBlob}
          >
            {videoBlob ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Video className="h-4 w-4" />
            )}
            <span>Start Recording</span>
          </Button>
        )}
      </div>
    </div>
  )
}

