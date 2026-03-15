
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore, useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Loader2, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { 
  ref as storageRef, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject,
  getStorage
} from 'firebase/storage';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function FileCenterPage() {
  const { user, isUserLoading } = useUser();
  const { firestore, firebaseApp } = useFirebase();
  const router = useRouter();
  const { toast } = useToast();
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUserLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.providerData.some(p => p.providerId === 'password') && !user.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, isUserLoading, router]);

  const userFilesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, 'users', user.uid, 'files'),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const { data: files, isLoading: isFilesLoading } = useCollection(userFilesQuery);

  const isNotVerified = user && user.providerData.some(p => p.providerId === 'password') && !user.emailVerified;

  if (isUserLoading || !user || isNotVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Arquivo muito grande",
        description: "O limite de upload é de 10MB.",
      });
      return;
    }

    setUploading(true);
    const storage = getStorage(firebaseApp);
    const storagePath = `users/${user.uid}/files/${Date.now()}_${file.name}`;
    const fileRef = storageRef(storage, storagePath);
    
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
        toast({
          variant: "destructive",
          title: "Erro no upload",
          description: "Não foi possível enviar o arquivo.",
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const fileId = doc(collection(firestore, 'users', user.uid, 'files')).id;
        
        await setDoc(doc(firestore, 'users', user.uid, 'files', fileId), {
          id: fileId,
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size,
          uploadedBy: user.uid,
          createdAt: serverTimestamp(),
          storagePath: storagePath
        });

        setUploading(false);
        setProgress(0);
        toast({
          title: "Upload concluído!",
          description: "Seu arquivo já está disponível na central.",
        });
      }
    );
  };

  const handleDelete = async (file: any) => {
    try {
      const storage = getStorage(firebaseApp);
      const fileRef = storageRef(storage, file.storagePath);
      
      await deleteObject(fileRef);
      await deleteDoc(doc(firestore, 'users', user.uid, 'files', file.id));
      
      toast({
        title: "Arquivo removido",
        description: "O arquivo foi excluído com sucesso.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível remover o arquivo.",
      });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-6 w-6 text-blue-400" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-400" />;
    return <File className="h-6 w-6 text-accent" />;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="font-headline text-3xl md:text-4xl font-bold text-white mb-2" style={{ textShadow: '0 0 10px hsla(var(--accent), 0.5)' }}>
                Central de Arquivos
              </h1>
              <p className="text-muted-foreground">
                Envie seus materiais (logo, textos, imagens) ou baixe documentos enviados pela Arete Groupp.
              </p>
            </div>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="bg-accent hover:bg-accent/90 text-white font-bold h-12 px-6 shadow-lg shadow-accent/20"
            >
              {uploading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Plus className="mr-2 h-5 w-5" />
              )}
              Enviar Novo Arquivo
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleUpload}
            />
          </div>

          {uploading && (
            <Card className="mb-8 border-accent/20 bg-accent/5">
              <CardContent className="pt-6">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>Enviando arquivo...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-secondary" />
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isFilesLoading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
              </div>
            ) : files && files.length > 0 ? (
              files.map((file: any) => (
                <Card key={file.id} className="bg-card border-border hover:border-accent/30 transition-all group overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-3 rounded-lg bg-secondary/50">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-bold text-white truncate">{file.name}</CardTitle>
                      <CardDescription className="text-xs">{formatSize(file.size)} • {new Date(file.createdAt?.toDate?.() || file.createdAt).toLocaleDateString('pt-BR')}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-accent/20 hover:bg-accent/10 hover:text-white text-xs h-9"
                      asChild
                    >
                      <a href={file.url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar
                      </a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(file)}
                      className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-card rounded-xl border border-dashed border-border">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-headline font-bold text-white mb-2">Nenhum arquivo enviado</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Sua central está vazia. Comece enviando a logo da sua empresa ou outros materiais do projeto.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 p-6 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-4">
            <ShieldCheck className="h-6 w-6 text-accent shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-white">Segurança Garantida</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Todos os arquivos são armazenados de forma criptografada e protegida por regras de segurança. 
                Apenas você e a equipe da Arete Groupp têm acesso a esses documentos.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
