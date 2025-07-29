import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../contexts/GoalContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';

export function DataManagement() {
  const { clearUserData } = useAuth();
  const { exportData, importData, clearAllData } = useGoals();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compass-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        const success = importData(data);
        setImportStatus(success ? 'success' : 'error');
        
        // 3秒後にステータスをリセット
        setTimeout(() => setImportStatus('idle'), 3000);
      } catch (error) {
        console.error('Import failed:', error);
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleClearAllData = () => {
    if (window.confirm('すべてのデータを削除しますか？この操作は元に戻せません。')) {
      clearAllData();
      clearUserData();
      window.location.reload(); // ページをリロードして初期状態に戻す
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">データ管理</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* エクスポート */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              データのエクスポート
            </CardTitle>
            <CardDescription>
              現在の目標・タスク・ユーザーデータをJSONファイルとしてダウンロードします
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleExport} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? 'エクスポート中...' : 'データをエクスポート'}
            </Button>
          </CardContent>
        </Card>

        {/* インポート */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              データのインポート
            </CardTitle>
            <CardDescription>
              以前にエクスポートしたデータを復元します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <label htmlFor="import-file">
              <Button asChild className="w-full">
                <span>ファイルを選択</span>
              </Button>
            </label>
            
            {importStatus === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">インポートが完了しました</span>
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">インポートに失敗しました</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* データクリア */}
      <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Trash2 className="h-5 w-5" />
            データの完全削除
          </CardTitle>
          <CardDescription className="text-red-600 dark:text-red-400">
            すべてのデータを削除して初期状態に戻します。この操作は元に戻せません。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleClearAllData}
            variant="destructive"
            className="w-full"
          >
            すべてのデータを削除
          </Button>
        </CardContent>
      </Card>

      {/* データ情報 */}
      <Card>
        <CardHeader>
          <CardTitle>データ情報</CardTitle>
          <CardDescription>
            現在のデータの保存状況について
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 text-sm">
            <div className="flex justify-between">
              <span>データ保存場所:</span>
              <span className="font-mono">ローカルストレージ</span>
            </div>
            <div className="flex justify-between">
              <span>データ永続化:</span>
              <span className="text-green-600">有効</span>
            </div>
            <div className="flex justify-between">
              <span>ブラウザ対応:</span>
              <span className="text-green-600">対応済み</span>
            </div>
            <div className="flex justify-between">
              <span>データ同期:</span>
              <span className="text-yellow-600">未対応</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>ヒント:</strong> データのバックアップを定期的に取ることをお勧めします。
              エクスポート機能を使用して、重要なデータを安全に保管してください。
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 