import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackTextInput, trackCopy, trackReset } from '@/utils/analytics';

const Index = () => {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const totalChars = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lines = text === '' ? 0 : text.split('\n').length;

  // Analytics tracking for text input
  useEffect(() => {
    if (text.length > 0) {
      const timeoutId = setTimeout(() => {
        trackTextInput(text.length);
      }, 1000); // 1초 후에 추적 (너무 자주 호출되지 않도록)

      return () => clearTimeout(timeoutId);
    }
  }, [text]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      trackCopy();
      toast({
        title: "복사 완료",
        description: "텍스트가 클립보드에 복사되었습니다.",
      });
    } catch (err) {
      toast({
        title: "복사 실패",
        description: "텍스트 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  }, [text, toast]);

  const handleReset = useCallback(() => {
    setText('');
    trackReset();
    toast({
      title: "초기화 완료",
      description: "입력 내용이 모두 삭제되었습니다.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            글자수 카운터
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            실시간으로 글자수를 확인하세요. 공백 포함/미포함 글자수를 한번에 볼 수 있습니다.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Text Input Area */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-800">텍스트 입력</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="여기에 텍스트를 입력하거나 붙여넣기 하세요..."
                  className="min-h-[400px] text-base leading-relaxed resize-none border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                />
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleCopy}
                    disabled={!text}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    복사하기
                  </Button>
                  <Button
                    onClick={handleReset}
                    disabled={!text}
                    variant="outline"
                    className="flex-1 h-12 text-base font-medium border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    초기화
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <div className="space-y-4">
            {/* Character Count */}
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {totalChars.toLocaleString()}
                  </div>
                  <div className="text-blue-100 font-medium">전체 글자수</div>
                  <div className="text-sm text-blue-200 mt-1">(공백 포함)</div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {charsWithoutSpaces.toLocaleString()}
                  </div>
                  <div className="text-indigo-100 font-medium">글자수</div>
                  <div className="text-sm text-indigo-200 mt-1">(공백 미포함)</div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Stats */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">단어 수</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {words.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px bg-gray-200"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">줄 수</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {lines.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="shadow-lg border-0 bg-gray-50/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-800 mb-3">💡 사용 팁</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 텍스트를 입력하면 실시간으로 글자수가 업데이트됩니다</li>
                  <li>• 복사 버튼으로 텍스트를 클립보드에 복사할 수 있습니다</li>
                  <li>• 초기화 버튼으로 모든 내용을 한번에 지울 수 있습니다</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            간편하고 빠른 글자수 카운터 © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
