import React, { useState } from 'react';
import { User, Mail, Shield, Database, Download, Upload, Trash2, ArrowLeft, Save, Edit } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../contexts/GoalContext';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface ProfileSettingsProps {
  onBack: () => void;
}

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const { user, updateUser } = useAuth();
  const { exportData, importData, clearAllData } = useGoals();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    futureVision: user?.futureVision || '',
    coreValues: user?.coreValues || []
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleExport = () => {
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
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        if (importData(data)) {
          alert('データのインポートが完了しました。');
        } else {
          alert('データのインポートに失敗しました。');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearData = () => {
    if (confirm('本当に全てのデータを削除しますか？この操作は取り消せません。')) {
      clearAllData();
      alert('データが削除されました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">設定</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">アカウントとデータの管理</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>プロフィール設定</span>
                    </CardTitle>
                    <CardDescription>ユーザー情報の編集</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'キャンセル' : '編集'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="futureVision">未来ビジョン</Label>
                  <textarea
                    id="futureVision"
                    value={formData.futureVision}
                    onChange={(e) => setFormData({ ...formData, futureVision: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                    rows={3}
                  />
                </div>
                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    保存
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>セキュリティ</span>
                </CardTitle>
                <CardDescription>パスワードとセキュリティ設定</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">現在のパスワード</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="現在のパスワードを入力"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">新しいパスワード</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="新しいパスワードを入力"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="新しいパスワードを再入力"
                    className="mt-1"
                  />
                </div>
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  パスワードを変更
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Data Management */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>データ管理</span>
                </CardTitle>
                <CardDescription>データのエクスポート・インポート・削除</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>データのエクスポート</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    現在のデータをJSONファイルとしてダウンロードします
                  </p>
                  <Button onClick={handleExport} variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    データをエクスポート
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>データのインポート</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    以前にエクスポートしたデータを復元します
                  </p>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      データをインポート
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>データの削除</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    全てのデータを完全に削除します（取り消せません）
                  </p>
                  <Button 
                    onClick={handleClearData} 
                    variant="destructive" 
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    全てのデータを削除
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>アカウント情報</CardTitle>
                <CardDescription>現在のアカウント状態</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">アカウント作成日</span>
                  <span className="text-sm font-medium">2024年1月15日</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">最終ログイン</span>
                  <span className="text-sm font-medium">今日 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">オンボーディング完了</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ 完了
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">データ保存</span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    ✓ ローカルストレージ
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 