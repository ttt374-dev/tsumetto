import { Capacitor } from "@capacitor/core"
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, Typography, Divider } from "@mui/material"
import { useRef } from "react"
import { useKifBackupRestore } from "../hooks/useKifBackupRestore"

type Props = {
    open: boolean
    onClose: () => void
}

export function KifBackupDialog({ open, onClose }: Props) {
    const { backup, restore } = useKifBackupRestore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    /* ===== backup ===== */
    const handleBackupOld = () => {
        const data = backup()
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        })

        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `kif-backup-${Date.now()}.json`
        a.click()
        URL.revokeObjectURL(url)
    }
    const handleBackup = async () => {
        const data = backup()
        const json = JSON.stringify(data, null, 2)

        if (Capacitor.isNativePlatform()) {
            // Android / iOS
            await Filesystem.writeFile({
                path: `kif-backup-${Date.now()}.json`,
                directory: Directory.Documents,
                data: json,
                encoding: Encoding.UTF8,
            })
            alert("バックアップを保存しました")
        } else {
            // Web
            const blob = new Blob([json], { type: "application/json" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `kif-backup-${Date.now()}.json`
            a.click()
            URL.revokeObjectURL(url)
        }
    }


    /* ===== restore ===== */
    const handleRestoreFile = async (file: File) => {
        const text = await file.text()
        const json = JSON.parse(text)

        if (!window.confirm("現在の棋譜・学習履歴はすべて上書きされます。よろしいですか？")) {
            return
        }

        restore(json)
        onClose()
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>バックアップ / 復元</DialogTitle>

            <DialogContent>
                {/* backup */}
                <Box mb={3}>
                    <Typography variant="h6">バックアップ</Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                        棋譜ライブラリと学習履歴を JSON ファイルとして保存します。
                    </Typography>
                    <Button variant="contained" onClick={handleBackup}>
                        バックアップを保存
                    </Button>
                </Box>

                <Divider />

                {/* restore */}
                <Box mt={3}>
                    <Typography variant="h6">復元</Typography>
                    <Typography variant="body2" color="error" mb={1}>
                        復元すると現在のデータはすべて上書きされます。
                    </Typography>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        バックアップを読み込む
                    </Button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/json"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleRestoreFile(file)
                            e.currentTarget.value = ""
                        }}
                    />
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>閉じる</Button>
            </DialogActions>
        </Dialog>
    )
}
